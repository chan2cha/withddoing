"use client";

import { useEffect, useState } from "react";
import LayoutShell from "@/components/LayoutShell";
import checklist from "@/data/checklist.json";

type CheckedMap = Record<string, boolean>;
const STORAGE_KEY = "withddoing-checklist-v1";

export default function ChecklistPage() {
    const [checked, setChecked] = useState<CheckedMap>({});

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setChecked(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    }, [checked]);

    return (
        <LayoutShell>
            <div className="grid">
                <section className="card">
                    <h2 className="h2">✅ 체크리스트</h2>
                    <div className="small">체크 상태는 이 폰에 저장돼요.</div>

                    <div style={{ marginTop: 12 }}>
                        {checklist.sections.map((section, si) => (
                            <div key={si} style={{ marginBottom: 14 }}>
                                <div className="pillrow">
                                    <span className="pill"><b>{section.name}</b></span>
                                    <span className="pill">{section.items.length}개</span>
                                </div>

                                <div className="list" style={{ marginTop: 8 }}>
                                    {section.items.map((item, ii) => {
                                        const key = `${si}-${ii}`;

                                        return (
                                            <label key={key} className="check">
                                                <input
                                                    type="checkbox"
                                                    checked={!!checked[key]}
                                                    onChange={(e) =>
                                                        setChecked((prev) => ({
                                                            ...prev,
                                                            [key]: e.target.checked,
                                                        }))
                                                    }
                                                />
                                                <div>
                                                    <div style={{ fontWeight: 800 }}>{item}</div>
                                                    <div className="small">{section.name}</div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="btn" onClick={() => setChecked({})}>
                        체크 초기화
                    </button>
                </section>

                <section className="card">
                    <h2 className="h2">📌 빠른 팁</h2>
                    <div className="list">
                        <div className="check">
                            <div style={{ fontWeight: 900 }}>현금</div>
                            <div className="small">Grab 현금 1순위 → 10만/20만동 단위 준비</div>
                        </div>
                        <div className="check">
                            <div style={{ fontWeight: 900 }}>태닝</div>
                            <div className="small">08:30~10:30 / 16:00~17:30 + 애프터선</div>
                        </div>
                        <div className="check">
                            <div style={{ fontWeight: 900 }}>샤워기필터</div>
                            <div className="small">헤드+리필 2~3개 + 젠더</div>
                        </div>
                    </div>
                </section>
            </div>
        </LayoutShell>
    );
}