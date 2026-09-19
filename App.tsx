import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type Tab = 'Home' | 'Workouts' | 'Progress';

type Exercise = {
  name: string;
  detail: string;
  category: string;
  color: string;
};

const exercises: Exercise[] = [
  { name: 'Goblet Squat', detail: '3 sets · 10 reps', category: 'Legs', color: '#F2B880' },
  { name: 'Push Ups', detail: '3 sets · 12 reps', category: 'Chest', color: '#A6D8C4' },
  { name: 'Bent-over Row', detail: '3 sets · 10 reps', category: 'Back', color: '#C6B9E8' },
  { name: 'Romanian Deadlift', detail: '3 sets · 8 reps', category: 'Hamstrings', color: '#F0A7A0' },
];

const completedDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Home');
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [seconds, setSeconds] = useState(45);

  const timerLabel = useMemo(() => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`, [seconds]);

  const startTimer = () => {
    setIsWorkoutStarted(true);
    if (seconds > 0) setSeconds((value) => Math.max(0, value - 5));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'Home' && (
            <>
              <View style={styles.header}>
                <View>
                  <Text style={styles.eyebrow}>SATURDAY, SEPTEMBER 19</Text>
                  <Text style={styles.title}>Good morning, Becca</Text>
                </View>
                <View style={styles.avatar}><Text style={styles.avatarText}>B</Text></View>
              </View>
              <View style={styles.heroCard}>
                <View style={styles.heroCopy}>
                  <Text style={styles.heroEyebrow}>UP NEXT</Text>
                  <Text style={styles.heroTitle}>Full Body Strength</Text>
                  <Text style={styles.heroMeta}>35 min · Intermediate</Text>
                  <TouchableOpacity style={styles.primaryButton} onPress={() => setActiveTab('Workouts')}>
                    <Text style={styles.primaryButtonText}>View workout  →</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.heroIcon}>✦</Text>
              </View>
              <SectionHeading title="Your week" action="See details" />
              <View style={styles.weekCard}>
                <View style={styles.weekRow}>{completedDays.map((day, index) => <Text style={styles.dayLabel} key={`${day}-${index}`}>{day}</Text>)}</View>
                <View style={styles.weekRow}>{completedDays.map((_, index) => <View style={[styles.dayCircle, index < 4 && styles.dayCircleDone]} key={index}><Text style={[styles.dayNumber, index < 4 && styles.dayNumberDone]}>{index + 15}</Text></View>)}</View>
                <View style={styles.streakRow}><Text style={styles.streakEmoji}>🔥</Text><Text style={styles.streakText}><Text style={styles.bold}>4 day streak</Text> · Keep it going!</Text></View>
              </View>
              <SectionHeading title="Quick start" action="" />
              <View style={styles.quickGrid}>
                <QuickAction icon="◷" label="Start workout" onPress={() => setActiveTab('Workouts')} />
                <QuickAction icon="▣" label="Browse exercises" onPress={() => setActiveTab('Workouts')} />
              </View>
            </>
          )}
          {activeTab === 'Workouts' && (
            <>
              <Text style={styles.pageTitle}>Workouts</Text>
              <Text style={styles.pageSubtitle}>Build strength, one session at a time.</Text>
              {isWorkoutStarted && <View style={styles.timerCard}><Text style={styles.timerLabel}>REST TIMER</Text><Text style={styles.timer}>{timerLabel}</Text><TouchableOpacity onPress={() => setSeconds(45)}><Text style={styles.resetText}>Reset timer</Text></TouchableOpacity></View>}
              <View style={styles.featureWorkout}><Text style={styles.heroEyebrow}>TODAY'S PLAN</Text><Text style={styles.featureTitle}>Full Body Strength</Text><Text style={styles.heroMeta}>6 exercises · 35 min · Intermediate</Text><TouchableOpacity style={styles.primaryButton} onPress={startTimer}><Text style={styles.primaryButtonText}>{isWorkoutStarted ? 'Complete set  →' : 'Start workout  →'}</Text></TouchableOpacity></View>
              <SectionHeading title="Exercise library" action="View all" />
              {exercises.map((exercise) => <View style={styles.exerciseRow} key={exercise.name}><View style={[styles.exerciseIcon, { backgroundColor: exercise.color }]}><Text style={styles.exerciseIconText}>✦</Text></View><View style={styles.exerciseCopy}><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.exerciseDetail}>{exercise.category} · {exercise.detail}</Text></View><Text style={styles.chevron}>›</Text></View>)}
            </>
          )}
          {activeTab === 'Progress' && <ProgressScreen />}
        </ScrollView>
        <View style={styles.tabBar}>{(['Home', 'Workouts', 'Progress'] as Tab[]).map((tab) => <TouchableOpacity style={styles.tab} key={tab} onPress={() => setActiveTab(tab)}><Text style={[styles.tabIcon, activeTab === tab && styles.activeTabText]}>{tab === 'Home' ? '⌂' : tab === 'Workouts' ? '◉' : '↗'}</Text><Text style={[styles.tabLabel, activeTab === tab && styles.activeTabText]}>{tab}</Text></TouchableOpacity>)}</View>
      </View>
    </SafeAreaView>
  );
}

function SectionHeading({ title, action }: { title: string; action: string }) { return <View style={styles.sectionHeading}><Text style={styles.sectionTitle}>{title}</Text>{action ? <Text style={styles.sectionAction}>{action}</Text> : null}</View>; }
function QuickAction({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) { return <TouchableOpacity style={styles.quickAction} onPress={onPress}><Text style={styles.quickIcon}>{icon}</Text><Text style={styles.quickLabel}>{label}</Text><Text style={styles.quickArrow}>›</Text></TouchableOpacity>; }
function ProgressScreen() { return <><Text style={styles.pageTitle}>Your progress</Text><Text style={styles.pageSubtitle}>Small improvements add up.</Text><View style={styles.metricsRow}><Metric value="12" label="Workouts" /><Metric value="8.4k" label="Calories" /><Metric value="4" label="Day streak" /></View><View style={styles.chartCard}><SectionHeading title="Training volume" action="Last 4 weeks" /><View style={styles.chart}><View style={[styles.bar, { height: 56 }]} /><View style={[styles.bar, { height: 90 }]} /><View style={[styles.bar, { height: 72 }]} /><View style={[styles.bar, { height: 124 }]} /></View><View style={styles.chartLabels}><Text>W1</Text><Text>W2</Text><Text>W3</Text><Text>W4</Text></View></View><SectionHeading title="Personal records" action="" /><View style={styles.record}><Text style={styles.recordName}>Goblet squat</Text><Text style={styles.recordValue}>24 kg <Text style={styles.recordChange}>+4 kg</Text></Text></View><View style={styles.record}><Text style={styles.recordName}>Push ups</Text><Text style={styles.recordValue}>18 reps <Text style={styles.recordChange}>+3 reps</Text></Text></View></>; }
function Metric({ value, label }: { value: string; label: string }) { return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8F5' }, container: { flex: 1 }, content: { padding: 24, paddingBottom: 120 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }, eyebrow: { color: '#7B837B', fontSize: 11, fontWeight: '700', letterSpacing: 1.2, marginBottom: 8 }, title: { color: '#17231D', fontSize: 25, fontWeight: '800' }, avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#D6E9DC', justifyContent: 'center', alignItems: 'center' }, avatarText: { color: '#275B40', fontSize: 18, fontWeight: '800' }, heroCard: { minHeight: 190, borderRadius: 24, backgroundColor: '#173B2A', padding: 24, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' }, heroCopy: { flex: 1 }, heroEyebrow: { color: '#A9D7B9', fontSize: 11, letterSpacing: 1.2, fontWeight: '800', marginBottom: 10 }, heroTitle: { color: '#FFFFFF', fontSize: 25, fontWeight: '800', marginBottom: 8 }, heroMeta: { color: '#C0D5C6', fontSize: 14 }, heroIcon: { color: '#9ED4AE', fontSize: 72, marginTop: 14 }, primaryButton: { alignSelf: 'flex-start', backgroundColor: '#D5F078', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginTop: 20 }, primaryButtonText: { color: '#173B2A', fontWeight: '800', fontSize: 13 }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 28, marginBottom: 14 }, sectionTitle: { color: '#17231D', fontSize: 18, fontWeight: '800' }, sectionAction: { color: '#4E8563', fontWeight: '700', fontSize: 13 }, weekCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18 }, weekRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, dayLabel: { width: 30, textAlign: 'center', color: '#9AA29C', fontWeight: '700', fontSize: 12 }, dayCircle: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3F0' }, dayCircleDone: { backgroundColor: '#D5F078' }, dayNumber: { color: '#8D968F', fontSize: 12, fontWeight: '700' }, dayNumberDone: { color: '#31553B' }, streakRow: { flexDirection: 'row', alignItems: 'center', marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#EEF0ED' }, streakEmoji: { fontSize: 17, marginRight: 8 }, streakText: { color: '#778079', fontSize: 13 }, bold: { color: '#26382D', fontWeight: '800' }, quickGrid: { flexDirection: 'row', gap: 12 }, quickAction: { flex: 1, minHeight: 100, padding: 16, borderRadius: 18, backgroundColor: '#E9F2E8' }, quickIcon: { color: '#3F7650', fontSize: 25, marginBottom: 14 }, quickLabel: { color: '#243C2D', fontWeight: '800', fontSize: 14 }, quickArrow: { position: 'absolute', right: 16, bottom: 14, color: '#5F8B6A', fontSize: 22 }, pageTitle: { color: '#17231D', fontSize: 30, fontWeight: '800', marginTop: 12 }, pageSubtitle: { color: '#7B837B', fontSize: 15, marginTop: 6, marginBottom: 18 }, featureWorkout: { backgroundColor: '#173B2A', borderRadius: 22, padding: 22 }, featureTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '800', marginBottom: 8 }, timerCard: { backgroundColor: '#D5F078', borderRadius: 18, padding: 18, alignItems: 'center', marginBottom: 16 }, timerLabel: { color: '#56703D', fontSize: 11, fontWeight: '800', letterSpacing: 1 }, timer: { color: '#173B2A', fontSize: 42, fontWeight: '800', marginVertical: 5 }, resetText: { color: '#496433', fontWeight: '700' }, exerciseRow: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, exerciseIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, exerciseIconText: { color: '#FFFFFF', fontSize: 20 }, exerciseCopy: { flex: 1, marginLeft: 13 }, exerciseName: { color: '#26382D', fontWeight: '800', fontSize: 15 }, exerciseDetail: { color: '#8B938C', fontSize: 12, marginTop: 4 }, chevron: { color: '#A5ADA6', fontSize: 27, marginRight: 5 }, tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 84, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#ECEFEB', flexDirection: 'row', justifyContent: 'space-around', paddingTop: 12 }, tab: { alignItems: 'center', flex: 1 }, tabIcon: { fontSize: 21, color: '#A1AAA2', marginBottom: 4 }, tabLabel: { color: '#A1AAA2', fontSize: 11, fontWeight: '700' }, activeTabText: { color: '#2D7046' }, metricsRow: { flexDirection: 'row', gap: 10, marginBottom: 18 }, metric: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14 }, metricValue: { color: '#173B2A', fontSize: 22, fontWeight: '800' }, metricLabel: { color: '#8B938C', fontSize: 11, marginTop: 5 }, chartCard: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18 }, chart: { height: 150, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: '#E7EBE5' }, bar: { width: 34, backgroundColor: '#A9D7B9', borderTopLeftRadius: 8, borderTopRightRadius: 8 }, chartLabels: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 9 }, chartLabelsText: { color: '#8B938C' }, record: { backgroundColor: '#FFFFFF', borderRadius: 15, padding: 17, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between' }, recordName: { color: '#34473A', fontWeight: '700' }, recordValue: { color: '#173B2A', fontWeight: '800' }, recordChange: { color: '#4E8563', fontSize: 11 }
});

export default App;
