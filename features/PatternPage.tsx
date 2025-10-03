"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { IoMdAdd as AddIcon } from "react-icons/io";
import { RiEdit2Fill as EditIcon } from "react-icons/ri";
import { MdDelete as DeleteIcon, MdCancel as CancelIcon } from "react-icons/md";
import { IoIosSave as SaveIcon } from "react-icons/io";

import LoadingIndicator from "@/components/loading-indicator";
import { useAuth } from "@/providers/auth-provider";
import { splitFormat, joinFormat } from "@/lib/utils";

export interface IPattern {
  id: string;
  user_id: string;
  name: string;
  value: string;
}

const PatternManagerPage: React.FC = () => {
  const { user_id } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [patterns, setPatterns] = useState<IPattern[]>([]);
  const [editingPattern, setEditingPattern] = useState<IPattern | null>(null);
  const [newPattern, setNewPattern] = useState({ name: "", value: "" });
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchPatterns = async () => {
      setIsLoading(true);
      const { data: { patterns }, status } = await axios.post("/api/common", { user_id });
      if (status === 200) {
        setPatterns(patterns);
      }
      setIsLoading(false);
    };
    fetchPatterns();
  }, []);

  // add or cancel new pattern
  const handleAddPattern = async () => {
    if (newPattern.name.trim() && newPattern.value.trim()) {
      const pattern: IPattern = {
        id: uuidv4(),
        user_id,
        name: joinFormat(splitFormat(newPattern.name.trim())),
        value: joinFormat(splitFormat(newPattern.value.trim())),
      };
      const { status } = await axios.post("/api/pattern", pattern);
      if (status === 200) {
        setPatterns([...patterns, pattern]);
      }
      setNewPattern({ name: "", value: "" });
      setShowAddForm(false);
    }
  };
  const handleCancelAdd = () => {
    setNewPattern({ name: "", value: "" });
    setShowAddForm(false);
  };

  // update or cancel edit pattern
  const handleEditPattern = async () => {
    if (
      editingPattern &&
      editingPattern.name.trim() &&
      editingPattern.value.trim()
    ) {
      const updatedPattern = {
        id: editingPattern.id,
        user_id,
        name: joinFormat(splitFormat(editingPattern.name.trim())),
        value: joinFormat(splitFormat(editingPattern.value.trim())),
      };
      const { status } = await axios.put("/api/pattern", {
        pattern: updatedPattern,
      });
      if (status === 200) {
        const updatedPatterns = patterns.map((p) =>
          p.id === editingPattern.id ? updatedPattern : p
        );
        setPatterns(updatedPatterns);
      }
      setEditingPattern(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingPattern(null);
  };

  // delete pattern
  const handleDeletePattern = async (id: string) => {
    const { status } = await axios.delete("/api/pattern", { data: { id } });
    if (status === 200) {
      setPatterns(patterns.filter((p) => p.id !== id));
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="flex flex-col grow bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50">
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-700 tracking-tight">
              パターン管理
            </h1>
            <Button
              onClick={() => setShowAddForm(true)}
              className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-none text-white p-6"
            >
              <AddIcon className="text-2xl font-bold" />
              <span className="text-lg">パターンを追加</span>
            </Button>
          </div>

          {/* Add new pattern form */}
          {showAddForm && (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="mb-3 font-bold text-lg">新しいパターンを追加</h3>
              <div className="flex flex-col space-y-4">
                <Input value={newPattern.name} 
                  onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value})}
                  placeholder="パターン名（例: パターンー1）"
                  className="rounded-sm px-3 py-5"
                />
                <Input value={newPattern.value}
                  onChange={(e) => setNewPattern({ ...newPattern, value: e.target.value})}
                  placeholder="パターン値（例: NO, 品名, 型番, 数量, 単価, 金額, 同等品, 原本情報）"
                  className="rounded-sm px-3 py-5"
                />
                <div className="flex gap-5">
                  <Button onClick={handleAddPattern}
                    disabled={!newPattern.name.trim() || !newPattern.value.trim()}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-none text-white px-6"
                  >
                    <AddIcon className="text-lg mr-2" />
                    <span>追加</span>
                  </Button>
                  <Button variant="outline" onClick={handleCancelAdd}
                    className="flex items-center bg-white text-blue-600 border-blue-600 hover:bg-white hover:text-blue-700 rounded-none"
                  >
                    <CancelIcon className="text-lg mr-2" />
                    <span>キャンセル</span>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Existing patterns */}
          <div className="flex flex-col space-y-4">
            {patterns.map((pattern) => (
              <div key={pattern.id}
                className="p-3 border border-gray-200 rounded-lg"
              >
                {editingPattern?.id === pattern.id ? (
                  // Edit mode
                  <div className="flex flex-col space-y-4">
                    <h3 className="mb-3 font-bold text-lg">パターンを編集</h3>
                    <Input value={editingPattern.name}
                      onChange={(e) => setEditingPattern({ ...editingPattern, name: e.target.value })}
                      placeholder="パターン名（例: パターンー1）"
                      className="rounded-sm px-3 py-5"
                    />
                    <Input value={editingPattern.value}
                      onChange={(e) => setEditingPattern({ ...editingPattern, value: e.target.value })}
                      placeholder="パターン値（例: NO, 品名, 型番, 数量, 単価, 金額, 同等品, 原本情報）"
                      className="rounded-sm px-3 py-5"
                    />
                    <div className="flex gap-5">
                      <Button onClick={handleEditPattern}
                        disabled={!editingPattern.name.trim() || !editingPattern.value.trim()}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 rounded-none text-white px-6"
                      >
                        <SaveIcon className="text-lg mr-2" />
                        <span>保存</span>
                      </Button>
                      <Button variant="outline" onClick={handleCancelEdit}
                        className="flex items-center bg-white text-blue-600 border-blue-600 hover:bg-white hover:text-blue-700 rounded-none"
                      >
                        <CancelIcon className="text-lg mr-2" />
                        <span>キャンセル</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Display mode
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{pattern.name}</h3>
                      <div className="inline-flex border px-4 py-1.5 text-m-btn text-sm border-m-btn rounded-full mt-2">
                        {pattern.value}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditingPattern(pattern)}
                        className="text-blue-600 text-2xl hover:text-blue-700"
                      >
                        <EditIcon />
                      </Button>
                      <Button
                        onClick={() => handleDeletePattern(pattern.id)}
                        className="text-red-500 text-2xl hover:text-red-600"
                      >
                        <DeleteIcon />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty state */}
          {patterns.length === 0 && !showAddForm && (
            <p className="bg-[#fcf8e3] border-[#faebcc] border-[1px] p-5 rounded-sm">
              パターンがありません。新しいパターンを追加してください。
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatternManagerPage;
