import LayoutShell from "@/components/LayoutShell";
import rules from "@/data/rules.json";

export default function RulesPage() {
    return (
        <LayoutShell>
            <section className="card" style={{ marginTop: 14 }}>
                <h2 className="h2">🧭 운영 룰(플랜B)</h2>
                <div className="small">가족 단톡에 공유해두면 당일 스트레스가 줄어요.</div>

                <div className="list" style={{ marginTop: 12 }}>
                    {rules.items.map((item, idx) => (
                        <div className="check" key={idx}>
                            <div style={{ minWidth: 20, fontWeight: 900 }}>{idx + 1}</div>
                            <div>{item}</div>
                        </div>
                    ))}
                </div>
            </section>
        </LayoutShell>
    );
}