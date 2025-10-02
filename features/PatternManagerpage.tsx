"use client";

import axios from "axios";
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  ThemeProvider,
  TextField,
  Button,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import { useAuth } from "@/providers/auth-provider";

import LoadingIndicator from "@/components/loading-indicator";
import { IoMdAdd as AddIcon } from "react-icons/io";
import { RiEdit2Fill as EditIcon } from "react-icons/ri";
import { MdDelete as DeleteIcon, MdCancel as CancelIcon } from "react-icons/md";
import { IoIosSave as SaveIcon } from "react-icons/io";

import theme from "@/lib/theme";
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
          <ThemeProvider theme={theme}>
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold text-gray-700 tracking-tight">
                パターン管理
              </h1>
              <Button
                variant="contained"
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <AddIcon className="text-2xl font-bold" />
                <span className="text-lg">パターンを追加</span>
              </Button>
            </div>

            {/* Add new pattern form */}
            {showAddForm && (
              <Box className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="mb-3 font-bold text-lg">新しいパターンを追加</h3>
                <div className="flex flex-col space-y-4">
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="パターン名"
                    value={newPattern.name}
                    onChange={(e) =>
                      setNewPattern({ ...newPattern, name: e.target.value })
                    }
                    placeholder="例: パターン-1"
                  />
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="パターン値"
                    value={newPattern.value}
                    onChange={(e) =>
                      setNewPattern({ ...newPattern, value: e.target.value })
                    }
                    placeholder="例: NO, 品名, 型番, 数量, 単価, 金額, 同等品, 原本情報"
                  />
                  <div className="flex gap-5">
                    <Button
                      variant="contained"
                      onClick={handleAddPattern}
                      disabled={
                        !newPattern.name.trim() || !newPattern.value.trim()
                      }
                    >
                      <AddIcon className="text-lg" />
                      <span>追加</span>
                    </Button>
                    <Button variant="outlined" onClick={handleCancelAdd}>
                      <CancelIcon className="text-lg mr-2" />
                      <span>キャンセル</span>
                    </Button>
                  </div>
                </div>
              </Box>
            )}

            {/* Existing patterns */}
            <div className="flex flex-col space-y-4">
              {patterns.map((pattern) => (
                <Box
                  key={pattern.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  {editingPattern?.id === pattern.id ? (
                    // Edit mode
                    <div className="flex flex-col space-y-4">
                      <h3 className="mb-3 font-bold text-lg">パターンを編集</h3>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="パターン名"
                        value={editingPattern.name}
                        onChange={(e) =>
                          setEditingPattern({
                            ...editingPattern,
                            name: e.target.value,
                          })
                        }
                      />
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="パターン値"
                        value={editingPattern.value}
                        onChange={(e) =>
                          setEditingPattern({
                            ...editingPattern,
                            value: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-5">
                        <Button
                          variant="contained"
                          onClick={handleEditPattern}
                          disabled={
                            !editingPattern.name.trim() ||
                            !editingPattern.value.trim()
                          }
                        >
                          <SaveIcon className="text-lg" />
                          <span>保存</span>
                        </Button>
                        <Button variant="outlined" onClick={handleCancelEdit}>
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
                        <Chip
                          label={pattern.value}
                          className="mt-1"
                          color="primary"
                          variant="outlined"
                        />
                      </div>
                      <div className="flex gap-2">
                        <IconButton
                          onClick={() => setEditingPattern(pattern)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeletePattern(pattern.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </div>
                  )}
                </Box>
              ))}
            </div>

            {/* Empty state */}
            {patterns.length === 0 && !showAddForm && (
              <p className="bg-[#fcf8e3] border-[#faebcc] border-[1px] p-5 rounded-sm">
                パターンがありません。新しいパターンを追加してください。
              </p>
            )}
          </ThemeProvider>
        </div>
      </main>
    </div>
  );
};

export default PatternManagerPage;
