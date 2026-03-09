import LayoutShell from "@/components/LayoutShell";
import Link from "next/link";

export default function InstallPage() {
    return (
        <>
            <section className="installHero card">
                <div className="installBadge">앱 설치 안내</div>
                <h1 className="installTitle">위드또잉을 휴대폰 홈 화면에 추가하세요</h1>
                <p className="installDesc">
                    한 번만 설치하면 카카오톡 링크를 다시 찾지 않아도 바로 열 수 있어요.
                </p>

                <div className="installQuickRow">
                    <Link className="btn installQuickBtn" href="/">
                        바로 열기
                    </Link>
                </div>
            </section>

            <div className="grid installGrid">
                <section className="card installCard">
                    <div className="installCardHead">
                        <div className="installIcon">🤖</div>
                        <div>
                            <h2 className="h2">안드로이드 설치</h2>
                            <div className="small">삼성 / 갤럭시 / 안드로이드 폰</div>
                        </div>
                    </div>

                    <div className="installSteps">
                        <div className="installStep">
                            <div className="installStepNum">1</div>
                            <div>
                                <div className="installStepTitle">크롬에서 이 페이지를 열어요</div>
                                <div className="small">카카오톡 안에서 열리면 오른쪽 위 메뉴에서 크롬으로 열어도 좋아요.</div>
                            </div>
                        </div>

                        <div className="installStep">
                            <div className="installStepNum">2</div>
                            <div>
                                <div className="installStepTitle">오른쪽 위 메뉴를 눌러요</div>
                                <div className="small">점 3개 메뉴를 누른 뒤 “홈 화면에 추가” 또는 “설치”를 찾아요.</div>
                            </div>
                        </div>

                        <div className="installStep">
                            <div className="installStepNum">3</div>
                            <div>
                                <div className="installStepTitle">설치를 누르면 끝</div>
                                <div className="small">휴대폰 바탕화면에 위드또잉 아이콘이 생겨요.</div>
                            </div>
                        </div>
                    </div>

                    <div className="installNote">
                        안드로이드 Chrome은 웹앱 페이지에서 메뉴의 <b>Add to home screen</b> 후 <b>Install</b>로 설치할 수 있어요.
                    </div>
                </section>

                <section className="card installCard">
                    <div className="installCardHead">
                        <div className="installIcon">🍎</div>
                        <div>
                            <h2 className="h2">아이폰 설치</h2>
                            <div className="small">아이폰 / 아이패드</div>
                        </div>
                    </div>

                    <div className="installSteps">
                        <div className="installStep">
                            <div className="installStepNum">1</div>
                            <div>
                                <div className="installStepTitle">사파리에서 이 페이지를 열어요</div>
                                <div className="small">아이폰은 설치할 때 Safari로 여는 게 가장 쉬워요.</div>
                            </div>
                        </div>

                        <div className="installStep">
                            <div className="installStepNum">2</div>
                            <div>
                                <div className="installStepTitle">아래 공유 버튼을 눌러요</div>
                                <div className="small">아래쪽 네모 + 화살표 모양 버튼을 누르면 돼요.</div>
                            </div>
                        </div>

                        <div className="installStep">
                            <div className="installStepNum">3</div>
                            <div>
                                <div className="installStepTitle">“홈 화면에 추가”를 눌러요</div>
                                <div className="small">추가를 누르면 바탕화면에 위드또잉 아이콘이 생겨요.</div>
                            </div>
                        </div>
                    </div>

                    <div className="installNote">
                        iPhone에서는 Safari에서 웹사이트를 연 뒤 <b>Share</b> 메뉴의 <b>Add to Home Screen</b>으로 추가할 수 있어요.
                    </div>
                </section>
            </div>

            <section className="card installHelpCard">
                <h2 className="h2">잘 안 보이면 이렇게 해보세요</h2>

                <div className="list">
                    <div className="check">
                        <div style={{ fontWeight: 900 }}>아이폰인데 메뉴가 안 보여요</div>
                        <div className="small">
                            Safari에서 열어야 해요. 다른 앱 안 브라우저 대신 Safari로 다시 열어보세요.
                        </div>
                    </div>

                    <div className="check">
                        <div style={{ fontWeight: 900 }}>홈 화면에 추가가 안 보여요</div>
                        <div className="small">
                            iPhone Safari에서는 공유 메뉴 아래쪽에서 액션을 편집해서 “홈 화면에 추가”를 보이게 할 수 있어요.
                        </div>
                    </div>

                    <div className="check">
                        <div style={{ fontWeight: 900 }}>안드로이드에서 설치가 안 보여요</div>
                        <div className="small">
                            Chrome 메뉴에서 “홈 화면에 추가” 또는 “설치”를 확인해보세요. 기기나 버전에 따라 이름이 조금 다를 수 있어요.
                        </div>
                    </div>
                </div>
            </section>

    </>
    );
}