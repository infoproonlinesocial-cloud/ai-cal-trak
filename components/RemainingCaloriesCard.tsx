import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { SegmentedHalfCircleProgress30 } from './HalfProgress';

interface RemainingCaloriesCardProps {
  remaining: number;
  total: number;
  consumed: number;
  protein: number;
  fat: number;
  carbs: number;
}

export default function RemainingCaloriesCard({
  remaining,
  total = 2000,
  consumed = 0,
  protein = 0,
  fat = 0,
  carbs = 0,
}: RemainingCaloriesCardProps) {
  const displayRemaining = remaining ?? Math.max(0, total - consumed);
  const progress = total > 0 ? consumed / total : 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Remaining Calories</Text>
          <View style={styles.caloriesRow}>
            <Text style={styles.caloriesText}>{displayRemaining}</Text>
            <Text style={styles.kcalUnit}> kcal</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editText}>Edit</Text>
          <Ionicons name="pencil" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <SegmentedHalfCircleProgress30 
          progress={progress} 
          size={200} 
          strokeWidth={20} 
          value={displayRemaining}
          label="Left"
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Consumed</Text>
          <Text style={styles.statValue}>{consumed}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Goal</Text>
          <Text style={styles.statValue}>{total}</Text>
        </View>
      </View>

      <View style={styles.macrosSection}>
        <View style={styles.macroItem}>
          <View style={[styles.macroIconContainer, { backgroundColor: Colors.primaryTransparent }]}>
            <Ionicons name="barbell-outline" size={18} color={Colors.primary} />
          </View>
          <View>
            <Text style={styles.macroLabel}>Protein</Text>
            <Text style={styles.macroValue}>{protein}g</Text>
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={[styles.macroIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
            <Ionicons name="water-outline" size={18} color={Colors.warning} />
          </View>
          <View>
            <Text style={styles.macroLabel}>Fat</Text>
            <Text style={styles.macroValue}>{fat}g</Text>
          </View>
        </View>

        <View style={styles.macroItem}>
          <View style={[styles.macroIconContainer, { backgroundColor: 'rgba(66, 133, 244, 0.15)' }]}>
            <Ionicons name="nutrition-outline" size={18} color={Colors.googleBlue} />
          </View>
          <View>
            <Text style={styles.macroLabel}>Carbs</Text>
            <Text style={styles.macroValue}>{carbs}g</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
    marginBottom: 4,
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  caloriesText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  kcalUnit: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    height: 120,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.divider,
  },
  macrosSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 16,
    borderRadius: 18,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  macroIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
});
