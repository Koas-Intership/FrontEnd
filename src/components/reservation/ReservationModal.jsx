import { Modal, Form, Input, DatePicker, TimePicker, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { createReservationRequest } from "@/features/reservation/reservationsSlice";

export default function ReservationModal({ open, onClose, room }) {
    //prop 확인
    console.log("[ReservationModal] Room: ", room);
    const dispatch = useDispatch();
    const creating = useSelector((s) => s.reservations.creating);

    const initialDate = dayjs(); // 오늘
    const initialTime = [dayjs().hour(10).minute(0), dayjs().hour(11).minute(0)];

    const onFinish = (values) => {
        const date = values.date.format("YYYY-MM-DD");
        const [start, end] = values.timeRange;
        const payload = {
            roomId: room?.id,
            date: values.date.format("YYYY-MM-DD"),
            start: values.timeRange[0].format("HH:mm"),
            end: values.timeRange[1].format("HH:mm"),
            title: values.title,
            memo: values.memo || "",
        };
        console.log("[UI] dispatch payload →", payload);  // ✅ 반드시 찍혀야 함
        dispatch(createReservationRequest(payload));
        onClose?.();
    };

    return (
        <Modal
            title={`예약하기 ${room ? `- ${room.name}` : ""}`}
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            centered
        >
            <Form
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ date: initialDate, timeRange: initialTime }}
            >
                <Form.Item label="회의실" >
                    <Input value={room?.name || "선택되지 않음"} disabled />
                </Form.Item>

                <Form.Item
                    label="회의 주제"
                    name="title"
                    rules={[{ required: true, message: "회의 제목을 입력하세요." }]}
                >
                    <Input placeholder="예: 월 매출 보고" />
                </Form.Item>

                <Form.Item
                    label="날짜"
                    name="date"
                    rules={[{ required: true, message: "날짜를 선택하세요." }]}
                >
                    <DatePicker style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    label="시간"
                    name="timeRange"
                    rules={[{ required: true, message: "시간을 선택하세요." }]}
                >
                    <TimePicker.RangePicker format="HH:mm" minuteStep={5} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="메모" name="memo">
                    <Input.TextArea placeholder="비고/준비물 등" rows={3} />
                </Form.Item>

                <Button htmlType="submit" type="primary" block loading={creating}>
                    예약 생성
                </Button>
            </Form>
        </Modal>
    );
}
