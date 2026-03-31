import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ChartBarLineIcon } from 'hugeicons-react-native';

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <Text style={styles.subtitle}>Track your nutritional progress</Text>
        </Animated.View>

        <View style={styles.placeholderContainer}>
          <ChartBarLineIcon size={64} color={Colors.primary} variant="stroke" />
          <Text style={styles.placeholderText}>Detailed analytics coming soon!</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  placeholderContainer: {
    flex: 1,
    height: 400,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 20,
    gap: 16,
  },
  placeholderText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
