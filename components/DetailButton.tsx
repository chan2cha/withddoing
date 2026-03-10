
type Props = {
    onClick : ()=>void,
}
export default function DetailButton ({onClick}:Props){
    return (
        <div className="actionRow">
            <button
                className="btn"
                type="button"
                onClick={onClick}
            >
                🔎 상세 정보
            </button>
        </div>
    )
}