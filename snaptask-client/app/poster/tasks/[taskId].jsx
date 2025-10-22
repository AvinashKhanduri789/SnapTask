import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TaskHeader from '../../../components/poster/Task/TaskHeader';
import TaskOverview from '../../../components/poster/Task/TaskOverview';
import TaskDescription from '../../../components/poster/Task/TaskDescription';
import TaskMetaInfo from '../../../components/poster/Task/TaskMetaInfo';
import BidsSection from '../../../components/poster/Task/BidsSection';
import ActionButtons from '../../../components/poster/Task/ActionButtons';
import StatusTimeline from '../../../components/poster/Task/StatusTimeline';
const TaskDetail = () => {
    const { taskId } = useLocalSearchParams();
    const router = useRouter();
    useEffect(() => {
        console.log("task id is :", taskId);
    }, [taskId]);
    const taskData = {
        id: taskId,
        title: 'UI Design Task',
        status: 'active',
        category: 'Design',
        postedOn: 'Oct 12, 2024',
        deadline: 'Oct 15, 2024',
        description: 'Need someone to design a poster for our upcoming hackathon...',
        budget: 800,
        duration: '3 days',
        mode: 'Remote',
        bids: 3, // Number of bids
        bidsList: [
            {
                id: 1,
                seekerName: 'Sarah Chen',
                tagline: 'UI/UX Designer, 3y exp',
                rating: 4.8,
                bidAmount: '₹750',
                timeline: '2 days',
                completedTasks: 24,
                message: 'I have extensive experience in hackathon poster design...'
            },
            {
                id: 2,
                seekerName: 'Mike Rodriguez',
                tagline: 'Product Designer, 2y exp',
                rating: 4.5,
                bidAmount: '₹650',
                timeline: '3 days',
                completedTasks: 18,
                message: 'I can deliver modern, eye-catching designs...'
            },
            {
                id: 3,
                seekerName: 'Emily Watson',
                tagline: 'Graphic Designer, 4y exp',
                rating: 4.9,
                bidAmount: '₹900',
                timeline: '1 day',
                completedTasks: 31,
                message: 'Specialized in tech event branding...'
            }
        ],
        timeline: [
            { stage: 'Created', date: 'Oct 12', completed: true },
            { stage: 'Assigned', date: '', completed: false },
            { stage: 'In Progress', date: '', completed: false },
            { stage: 'Pending Review', date: '', completed: false },
            { stage: 'Completed', date: '', completed: false }
        ]
    };
    return (
        <>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
                <TaskHeader taskTitle={taskData.title} />
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 16 }}>
                        {/* Task Overview */}
                        <TaskOverview
                            title={taskData.title}
                            status={taskData.status}
                            category={taskData.category}
                            postedOn={taskData.postedOn}
                            deadline={taskData.deadline}
                        />
                        {/* Status Timeline */}
                        <StatusTimeline timeline={taskData.timeline} />
                        {/* Task Description */}
                        <TaskDescription description={taskData.description} />
                        {/* Task Meta Info */}
                        <TaskMetaInfo
                            budget={taskData.budget}
                            duration={taskData.duration}
                            mode={taskData.mode}
                            applicants={taskData.bids}
                        />
                        {/* Applicants Section */}
                        <BidsSection
                            bids={taskData.bidsList}
                            onViewBid={(bid) => {
                                // Navigate to bid details or open modal
                                console.log('Viewing bid:', bid);
                                router.push(`/poster/seekerProfile/${bid.bidId}`);
                            }}
                        />
                    </View>
                </ScrollView>
                {/* Action Buttons */}
                <ActionButtons taskId={taskData.id} status={taskData.status} taskData={taskData} />
            </SafeAreaView>
        </>
    )
}
export default TaskDetail;
