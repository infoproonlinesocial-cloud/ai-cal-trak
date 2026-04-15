import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

interface DateItem {
  date: Date;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  id: string; // YYYY-MM-DD
}

interface WeekCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function WeekCalendar({ selectedDate, onDateSelect }: WeekCalendarProps) {
  const [dates, setDates] = useState<DateItem[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    generateWeekDates();
  }, []);

  const generateWeekDates = () => {
    try {
      const today = new Date();
      const currentDay = today.getDay(); // 0 (Sun) to 6 (Sat)
      
      // Calculate Monday of the current week (start of week)
      const diff = today.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
      const monday = new Date(new Date().setDate(diff));
      
      const weekDates: DateItem[] = [];
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 0; i < 7; i++) {
          const date = new Date(monday);
          date.setDate(monday.getDate() + i);
          
          const dayName = dayNames[date.getDay()];
          const id = date.toISOString().split('T')[0]; // YYYY-MM-DD
          
          weekDates.push({
              date: date,
              dayName: dayName,
              dayNumber: date.getDate().toString(),
              isToday: date.toDateString() === new Date().toDateString(),
              id: id,
          });
      }
      setDates(weekDates);
    } catch (error) {
      console.error("Error generating week dates:", error);
    }
  };

  const renderItem = ({ item }: { item: DateItem }) => {
    const isSelected = selectedDate === item.id;
    const isToday = item.isToday;

    return (
      <TouchableOpacity
        onPress={() => onDateSelect(item.id)}
        style={[
          styles.dateItem,
          isSelected && styles.selectedDateItem,
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
            styles.dayName,
            isSelected ? styles.selectedText : isToday ? styles.todayText : null
        ]}>
          {item.dayName}
        </Text>
        <View
          style={[
            styles.dateCircle,
            isSelected ? styles.selectedCircle : isToday ? styles.todayCircle : null,
          ]}
        >
          <Text
            style={[
              styles.dateNumber,
              isSelected ? styles.selectedDateNumber : isToday ? styles.todayDateNumber : null,
            ]}
          >
            {item.dayNumber}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (dates.length === 0) {
    return <View style={styles.container}><Text style={{color: 'white', padding: 20}}>Loading dates...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={dates}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: Colors.background,
    minHeight: 100, // Ensure it's visible even if content is weird
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  dateItem: {
    width: 58,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 30,
  },
  selectedDateItem: {
    // Optional: add a background to the whole item if needed
  },
  dayName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  dateCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCircle: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  todayCircle: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryTransparent,
  },
  dateNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  selectedDateNumber: {
    color: Colors.textDark,
  },
  todayDateNumber: {
    color: Colors.primary,
  },
  selectedText: {
    color: Colors.primary,
  },
  todayText: {
    color: Colors.primary,
  },
});
