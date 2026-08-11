"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { leadDisplayName } from "@/lib/lead-utils";
import { downloadCSV, slugifyFilename } from "@/lib/csv";
import {
  updateLeadStage,
  createLeadList,
  assignLeadsToList,
  removeLeadsFromList,
  deleteLeads,
} from "@/app/[lang]/admin/leads/actions";
import LeadListSidebar from "./LeadListSidebar";
import ImportCSVModal from "./ImportCSVModal";
import LeadDetailModal from "./LeadDetailModal";

const UNASSIGNED = "__unassigned__";

export default function LeadsClient({ initialLeads, stages, lists: initialLists }) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [leads, setLeads] = useState(initialLeads);
  const [lists, setLists] = useState(initialLists);
  const [view, setView] = useState("kanban"); // 'kanban' | 'list'
  const [activeListId, setActiveListId] = useState(null);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState([]); // stage ids
  const [selected, setSelected] = useState(new Set());

  const [showImport, setShowImport] = useState(false);
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [createError, setCreateError] = useState(null);
  const [detailLead, setDetailLead] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const stageName = useMemo(() => {
    const m = {};
    for (const s of stages) m[s.id] = s.name;
    return m;
  }, [stages]);

  // ── Filtering ──
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return leads.filter((l) => {
      if (activeListId && l.list_id !== activeListId) return false;
      if (stageFilter.length && !stageFilter.includes(l.stage_id)) return false;
      if (q) {
        const hay = `${l.first_name ?? ""} ${l.last_name ?? ""} ${l.email ?? ""} ${l.phone ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [leads, activeListId, stageFilter, search]);

  const totalCount = useMemo(
    () => leads.filter((l) => !activeListId || l.list_id === activeListId).length,
    [leads, activeListId]
  );

  function refresh() {
    startTransition(() => router.refresh());
  }

  // ── Kanban drag-drop ──
  function handleDrop(stageId) {
    if (!dragId) return;
    const targetStage = stageId === UNASSIGNED ? null : stageId;
    setLeads((prev) =>
      prev.map((l) => (l.id === dragId ? { ...l, stage_id: targetStage } : l))
    );
    updateLeadStage(dragId, targetStage).then((res) => {
      if (res?.error) refresh(); // revert via server truth
    });
    setDragId(null);
    setDragOver(null);
  }

  // ── Selection (list view) ──
  function toggleSelect(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleSelectAll() {
    setSelected((prev) =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map((l) => l.id))
    );
  }

  // ── Bulk actions ──
  async function bulkAssign(listId) {
    const ids = [...selected];
    setLeads((prev) => prev.map((l) => (selected.has(l.id) ? { ...l, list_id: listId } : l)));
    setSelected(new Set());
    await assignLeadsToList(ids, listId);
    refresh();
  }
  async function bulkRemoveFromList() {
    const ids = [...selected];
    setLeads((prev) => prev.map((l) => (selected.has(l.id) ? { ...l, list_id: null } : l)));
    setSelected(new Set());
    await removeLeadsFromList(ids);
    refresh();
  }
  async function bulkDelete() {
    if (!confirm(`Xóa ${selected.size} khách hàng khỏi CRM? Hành động không thể hoàn tác.`)) return;
    const ids = [...selected];
    setLeads((prev) => prev.filter((l) => !selected.has(l.id)));
    setSelected(new Set());
    await deleteLeads(ids);
    refresh();
  }

  // ── Create list ──
  async function submitCreateList() {
    setCreateError(null);
    const res = await createLeadList(newListName);
    if (res?.error) {
      setCreateError(res.error);
      return;
    }
    setLists((prev) => [res.list, ...prev]);
    setShowCreateList(false);
    setNewListName("");
  }

  // ── Export ──
  function handleExport() {
    if (filtered.length === 0) return;
    const rows = filtered.map((l) => ({
      "Họ tên": leadDisplayName(l),
      Email: l.email ?? "",
      "Số điện thoại": l.phone ?? "",
      "Giai đoạn": stageName[l.stage_id] ?? "",
      "Ngày tạo": l.created_at ? new Date(l.created_at).toLocaleDateString("vi-VN") : "",
    }));
    const listName = activeListId ? lists.find((l) => l.id === activeListId)?.name : "tat-ca";
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(rows, `${slugifyFilename(listName)}_${date}.csv`);
  }

  // ── Kanban columns ──
  const columns = useMemo(() => {
    const cols = stages.map((s) => ({ id: s.id, label: s.name }));
    const hasUnassigned = filtered.some((l) => !l.stage_id);
    if (hasUnassigned) cols.unshift({ id: UNASSIGNED, label: "Chưa phân loại" });
    return cols;
  }, [stages, filtered]);

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
            Quản lý CRM
          </h1>
          <p className="font-body-md text-slate-subtext mt-1">
            {filtered.length} khách hàng
            {activeListId && lists.find((l) => l.id === activeListId)
              ? ` trong "${lists.find((l) => l.id === activeListId).name}"`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View toggle */}
          <div className="flex bg-mist-bg rounded-full p-1">
            <button
              onClick={() => setView("kanban")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                view === "kanban" ? "bg-white shadow text-primary-container" : "text-slate-subtext"
              }`}
            >
              <span className="material-symbols-outlined text-base">view_kanban</span>
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 ${
                view === "list" ? "bg-white shadow text-primary-container" : "text-slate-subtext"
              }`}
            >
              <span className="material-symbols-outlined text-base">table_rows</span>
            </button>
          </div>

          <button
            onClick={() => setShowImport(true)}
            className="border border-border-subtle text-ink-text px-4 py-2.5 rounded-full font-button-text text-button-text text-sm hover:border-primary-container/40 transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-base">upload</span>
            Import
          </button>
          <button
            onClick={handleExport}
            disabled={filtered.length === 0}
            className="border border-border-subtle text-ink-text px-4 py-2.5 rounded-full font-button-text text-button-text text-sm hover:border-primary-container/40 transition-all flex items-center gap-1.5 disabled:opacity-40"
            title={filtered.length === 0 ? "Không có dữ liệu để export" : "Export CSV"}
          >
            <span className="material-symbols-outlined text-base">download</span>
            Export
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <LeadListSidebar
          lists={lists}
          activeListId={activeListId}
          totalCount={leads.length}
          onSelect={setActiveListId}
          onCreateClick={() => setShowCreateList(true)}
        />

        {/* Main */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search + filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-subtext/50 text-lg">
                search
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm tên, email, SĐT..."
                className="w-full pl-10 pr-4 py-2.5 border border-border-subtle rounded-full text-sm bg-white focus:outline-none focus:border-primary-container"
              />
            </div>
            <select
              value={stageFilter[0] ?? ""}
              onChange={(e) => setStageFilter(e.target.value ? [e.target.value] : [])}
              className="border border-border-subtle rounded-full px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-primary-container"
            >
              <option value="">Tất cả giai đoạn</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {(search || stageFilter.length) > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setStageFilter([]);
                }}
                className="text-xs text-slate-subtext hover:text-primary-container underline"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          {/* Bulk action bar */}
          {view === "list" && selected.size > 0 && (
            <div className="flex items-center gap-3 flex-wrap bg-primary-container/5 border border-primary-container/20 rounded-xl px-4 py-3">
              <span className="font-body-md text-sm font-bold text-primary-container">
                Đã chọn {selected.size}
              </span>
              <select
                onChange={(e) => e.target.value && bulkAssign(e.target.value)}
                value=""
                className="border border-border-subtle rounded-lg px-3 py-1.5 text-xs bg-white"
              >
                <option value="">+ Thêm vào danh sách</option>
                {lists.map((l) => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>
              <button onClick={bulkRemoveFromList} className="text-xs text-slate-subtext hover:text-ink-text">
                Xóa khỏi danh sách
              </button>
              <button onClick={bulkDelete} className="text-xs text-error hover:underline">
                Xóa lead
              </button>
            </div>
          )}

          {/* KANBAN */}
          {view === "kanban" && (
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ WebkitOverflowScrolling: "touch" }}>
              {columns.map((col) => {
                const colLeads = filtered.filter((l) =>
                  col.id === UNASSIGNED ? !l.stage_id : l.stage_id === col.id
                );
                const isOver = dragOver === col.id;
                return (
                  <div
                    key={col.id}
                    className="flex flex-col gap-3 min-w-[280px] w-[280px]"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(col.id);
                    }}
                    onDrop={() => handleDrop(col.id)}
                    onDragLeave={() => setDragOver(null)}
                  >
                    <div
                      className={`px-4 py-3 rounded-xl border transition-all ${
                        isOver ? "bg-primary-container/10 border-primary-container/40" : "bg-white/80 border-border-subtle"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-button-text text-button-text text-ink-text uppercase text-xs truncate">
                          {col.label}
                        </span>
                        <span className="w-6 h-6 rounded-full bg-primary-container/10 text-primary-container font-black text-xs flex items-center justify-center shrink-0">
                          {colLeads.length}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex flex-col gap-2 min-h-[200px] p-2 rounded-xl transition-all ${
                        isOver ? "bg-primary-container/5 ring-2 ring-primary-container/20" : ""
                      }`}
                    >
                      {colLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={() => setDragId(lead.id)}
                          onDragEnd={() => {
                            setDragId(null);
                            setDragOver(null);
                          }}
                          onClick={() => setDetailLead(lead)}
                          className="glass-card rounded-xl p-4 cursor-pointer space-y-3 hover:border-primary-container/30 transition-all hover:-translate-y-0.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-subtext/30 text-base">drag_indicator</span>
                            <p className="font-headline-sub text-headline-sub text-ink-text text-sm truncate">
                              {leadDisplayName(lead) || "(Chưa có tên)"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            {lead.phone && (
                              <p className="font-body-md text-slate-subtext text-xs flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">phone</span>
                                {lead.phone}
                              </p>
                            )}
                            {lead.email && (
                              <p className="font-body-md text-slate-subtext text-xs flex items-center gap-1 truncate">
                                <span className="material-symbols-outlined text-xs">mail</span>
                                {lead.email}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                      {colLeads.length === 0 && (
                        <div className="flex-1 flex items-center justify-center rounded-xl border-2 border-dashed border-border-subtle min-h-[100px]">
                          <p className="font-body-md text-slate-subtext/40 text-sm">Thả vào đây</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* LIST VIEW */}
          {view === "list" && (
            <div className="overflow-x-auto border border-border-subtle rounded-xl bg-white">
              <table className="w-full text-sm">
                <thead className="bg-mist-bg">
                  <tr>
                    <th className="px-3 py-3 w-10">
                      <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                    </th>
                    <th className="px-3 py-3 text-left font-bold text-ink-text">Tên</th>
                    <th className="px-3 py-3 text-left font-bold text-ink-text">Email</th>
                    <th className="px-3 py-3 text-left font-bold text-ink-text">SĐT</th>
                    <th className="px-3 py-3 text-left font-bold text-ink-text">Giai đoạn</th>
                    <th className="px-3 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((lead) => (
                    <tr key={lead.id} className="border-t border-border-subtle hover:bg-mist-bg/50">
                      <td className="px-3 py-3">
                        <input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggleSelect(lead.id)} />
                      </td>
                      <td className="px-3 py-3 font-medium text-ink-text">{leadDisplayName(lead) || "—"}</td>
                      <td className="px-3 py-3 text-slate-subtext">{lead.email || "—"}</td>
                      <td className="px-3 py-3 text-slate-subtext">{lead.phone || "—"}</td>
                      <td className="px-3 py-3 text-slate-subtext">{stageName[lead.stage_id] || "—"}</td>
                      <td className="px-3 py-3">
                        <button onClick={() => setDetailLead(lead)} className="text-slate-subtext hover:text-primary-container">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-10 text-center text-slate-subtext/50">
                        Không tìm thấy khách hàng phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ImportCSVModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        lists={lists}
        onImported={() => refresh()}
      />
      <LeadDetailModal
        isOpen={!!detailLead}
        lead={detailLead}
        lists={lists}
        stages={stages}
        onClose={() => setDetailLead(null)}
        onSaved={() => refresh()}
      />

      {/* Create list mini-modal */}
      {showCreateList && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink-text/40 backdrop-blur-sm" onClick={() => setShowCreateList(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <h2 className="font-headline-sub text-headline-sub font-bold text-ink-text">Tạo danh sách mới</h2>
            <input
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="VD: Webinar 15/07"
              maxLength={100}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && submitCreateList()}
              className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary-container"
            />
            {createError && <p className="text-error text-sm">{createError}</p>}
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowCreateList(false)} className="text-sm text-slate-subtext hover:text-ink-text px-4 py-2">
                Hủy
              </button>
              <button
                onClick={submitCreateList}
                disabled={!newListName.trim()}
                className="bg-primary-container text-white px-6 py-2.5 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform disabled:opacity-50"
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
