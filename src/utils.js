import { MILESTONES, PRIZES } from './data';

export const calcPrize = (correctCount, reason) => {
    if (correctCount === 15) return PRIZES[14]; // Thắng cả 15 câu

    // Lọc các mốc an toàn không lớn hơn số câu trả lời đúng
    const passedMilestones = MILESTONES.filter((m) => m <= correctCount);
    if (passedMilestones.length === 0) return 0;

    // Lấy mốc an toàn cao nhất đã vượt qua
    const maxMilestone = Math.max(...passedMilestones);
    return PRIZES[maxMilestone - 1];
};