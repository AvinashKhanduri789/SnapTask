import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import TaskHeader from '../../../components/poster/Task/TaskHeader';
import TaskOverview from '../../../components/poster/Task/TaskOverview';
import TaskDescription from '../../../components/poster/Task/TaskDescription';
import TaskMetaInfo from '../../../components/poster/Task/TaskMetaInfo';
import ApplicantsSection from '../../../components/poster/Task/ApplicantsSection';
import ActionButtons from '../../../components/poster/Task/ActionButtons';
import StatusTimeline from '../../../components/poster/Task/StatusTimeline';
const TaskDetail = () => {
    const { taskId } = useLocalSearchParams();
    const router = useRouter();

    useEffect(() => {
        console.log("task id is :", taskId);
    }, [taskId]);


    // Mock data - in real app, fetch by id
    const taskData = {
        id: taskId,
        title: 'UI Design Task',
        status: 'active',
        category: 'Design',
        postedOn: 'Oct 12, 2024',
        deadline: 'Oct 15, 2024',
        description: 'Need someone to design a poster for our upcoming hackathon. Should be modern, clean, and use blue gradients. The design should be eye-catching and represent innovation and technology.',
        budget: 800,
        duration: '3 days',
        mode: 'Remote',
        applicants: 3,
        applicantsList: [
            {
                id: 1,
                name: 'Sarah Chen',
                tagline: 'UI/UX Designer, 3y exp',
                rating: 4.8,
                avatar: 'SC',
                status: 'pending'
            },
            {
                id: 2,
                name: 'Mike Rodriguez',
                tagline: 'Product Designer, 2y exp',
                rating: 4.5,
                avatar: 'MR',
                status: 'pending'
            },
            {
                id: 3,
                name: 'Emily Watson',
                tagline: 'Graphic Designer, 4y exp',
                rating: 4.9,
                avatar: 'EW',
                status: 'pending'
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
                            applicants={taskData.applicants}
                        />

                        {/* Applicants Section */}
                        <ApplicantsSection applicants={taskData.applicantsList} />
                    </View>
                </ScrollView>

                {/* Action Buttons */}
                <ActionButtons taskId={taskData.id} status={taskData.status} />
            </SafeAreaView>
        </>
    )
}


export default TaskDetail;
