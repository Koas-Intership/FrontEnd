export default function ReservationCancelModal({ open, reservation, onClose, onConfirm }) {
    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: 'min(420px, 92vw)',
                    background: '#fff',
                    borderRadius: 12,
                    padding: 20,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                }}
            >
                <h4 style={{ margin: 0, marginBottom: 8 }}>예약 취소</h4>
                <p style={{ marginTop: 0, color: '#374151' }}>
                    아래 예약을 취소하시겠습니까?
                    <br />
                    <b>{reservation?.title}</b> — {reservation?.roomName}
                    <br />
                    {reservation?.date} {reservation?.start} ~ {reservation?.end}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            border: '1px solid #d1d5db',
                            background: 'white',
                            padding: '6px 12px',
                            borderRadius: 8,
                            cursor: 'pointer',
                        }}
                    >
                        닫기
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        style={{
                            border: '1px solid #ef4444',
                            color: '#fff',
                            background: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: 8,
                            cursor: 'pointer',
                        }}
                    >
                        확인(취소)
                    </button>
                </div>
            </div>
        </div>
    );
}
