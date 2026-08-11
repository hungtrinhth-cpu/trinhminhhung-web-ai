"use client";

export default function LeadListSidebar({
  lists,
  activeListId,
  totalCount,
  onSelect,
  onCreateClick,
}) {
  return (
    <div className="w-full lg:w-60 shrink-0 space-y-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="font-label-eyebrow text-label-eyebrow text-slate-subtext uppercase tracking-widest">
          Danh sách
        </span>
        <button
          onClick={onCreateClick}
          className="text-primary-container hover:text-secondary transition-colors flex items-center"
          aria-label="Tạo danh sách mới"
          title="Tạo danh sách mới"
        >
          <span className="material-symbols-outlined text-lg">add_circle</span>
        </button>
      </div>

      {/* All leads */}
      <button
        onClick={() => onSelect(null)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-body-md text-sm transition-all ${
          activeListId === null
            ? "bg-primary-container text-white font-bold"
            : "text-ink-text hover:bg-mist-bg"
        }`}
      >
        <span className="flex items-center gap-2 truncate">
          <span className="material-symbols-outlined text-base">groups</span>
          Tất cả khách hàng
        </span>
        <span
          className={`text-xs font-black ${
            activeListId === null ? "text-white" : "text-slate-subtext"
          }`}
        >
          {totalCount}
        </span>
      </button>

      {/* Each list */}
      {lists.map((list) => {
        const active = activeListId === list.id;
        return (
          <button
            key={list.id}
            onClick={() => onSelect(list.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-body-md text-sm transition-all ${
              active
                ? "bg-primary-container text-white font-bold"
                : "text-ink-text hover:bg-mist-bg"
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <span className="material-symbols-outlined text-base">folder</span>
              <span className="truncate">{list.name}</span>
            </span>
            <span
              className={`text-xs font-black shrink-0 ${
                active ? "text-white" : "text-slate-subtext"
              }`}
            >
              {list.count}
            </span>
          </button>
        );
      })}

      {lists.length === 0 && (
        <p className="px-3 py-2 font-body-md text-slate-subtext/50 text-xs">
          Chưa có danh sách nào. Nhấn + để tạo.
        </p>
      )}
    </div>
  );
}
