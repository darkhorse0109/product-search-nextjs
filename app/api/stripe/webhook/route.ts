import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { withDatabase } from "@/lib/db";
import { env } from '@/lib/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Stripeシグネチャが見つかりません' }, { status: 400 });
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      return NextResponse.json({ error: 'シグネチャが無効です' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Webhookハンドラーが失敗しました' }, { status: 500 });
  }
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const amount = invoice.subtotal ?? 0;
  // const currency = invoice.currency || "jpy";
  const customerId = invoice.customer as string;
  const credits = env.CREDITS_PER_MONTH_FOR_PAID_PLAN
  const plan = amount === Number(env.CURRENCY_PER_MONTH_FOR_PAID_PLAN) ? 'Plus' : 'Trial'

  if (invoice.billing_reason === "subscription_cycle") {
    const queryStr = `
      UPDATE users
      SET balance = ?, subscription = ?
      WHERE stripe_customer_id = ?
    `;

    try {
      await withDatabase(async (db) => {
        await db.execute(queryStr, [credits, plan, customerId]);
      })
      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error("Error in invoice.payment_succeeded /api/stripe/webhook: ", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email;
  const amount = session.amount_subtotal || 0;
  // const currency = session.currency || "jpy";
  const customerId = session.customer as string;

  const queryStr = `SELECT * FROM users WHERE email = ?`;
  const user = await withDatabase(async (db) => {
    const [rows]: any = await db.query(queryStr, [email]);
    return rows.length === 1 ? rows[0] : null;
  });
  
  if (!user) {
    console.error('メールアドレスに該当するユーザーが見つかりません: ', email);
    return;
  }

  const uid = user.id;
  const credits = env.CREDITS_PER_MONTH_FOR_PAID_PLAN

  if (session.mode === 'subscription') {
    const plan = amount === Number(env.CURRENCY_PER_MONTH_FOR_PAID_PLAN) ? 'Plus' : 'Trial'

    const queryStr = `
      UPDATE users
      SET balance = ?, subscription = ?, stripe_customer_id = ?
      WHERE id = ?
    `;
    await withDatabase(async (db) => {
      await db.execute(queryStr, [credits, plan, customerId, uid]);
    })
  } else if (session.mode === 'payment') {
    const newBalance = (user.balance || 0) + 1000;
    const queryStr = `
      UPDATE users
      SET balance = ?
      WHERE id = ?
    `;

    await withDatabase(async (db) => {
      await db.execute(queryStr, [newBalance, uid]);
    })
  }
}

async function handlePaymentFailed(failedInvoice: Stripe.Invoice) {
  const customerId = failedInvoice.customer as string;
  const queryStr = `
    UPDATE users
    SET subscription = ?
    WHERE stripe_customer_id = ?
  `;

  try {
    await withDatabase(async (db) => {
      await db.execute(queryStr, ['Trial', customerId]);
    })
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error in invoice.payment_failed /api/stripe/webhook: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const queryStr = `
    UPDATE users
    SET subscription = ?
    WHERE stripe_customer_id = ?
  `;

  try {
    await withDatabase(async (db) => {
      await db.execute(queryStr, ['Trial', customerId]);
    })
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error in customer.subscription.deleted /api/stripe/webhook: ", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}