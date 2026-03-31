# Enhanced AI Generation Loading State

Improve the user experience during the AI plan generation process by replacing the single loading indicator with a step-by-step checklist that provides feedback on the progress.

## Proposed Changes

### Results Screen `app/results.tsx`

#### [MODIFY] [results.tsx](file:///d:/0-ViebCodingProjects/ai-cal-tarck/app/results.tsx)

- **New State Variables**:
  - `currentStep`: Track the index of the current loading step.
  - `isAIComplete`: Track when the Gemini model has returned the plan and it's been saved.
- **Loading Steps Definition**:
  1. `Gathering your profile...`
  2. `Analyzing body metrics...`
  3. `Calculating daily calorie needs...`
  4. `Optimizing macronutrients (P/C/F)...`
  5. `Generating final recommendations...`
- **Timer Logic**:
  - Implement a `useEffect` that increments `currentStep` every 1.5 seconds until it reaches index 3 (the second-to-last step).
  - The last step (index 4) will transition to completed only when both `isAIComplete` is true and the timer reaches the final index.
- **UI Components**:
  - **LoadingChecklist**: A new component to display the list of steps.
  - **StepItem**: Animated component for each step with a checkmark (for completed) or spinner (for active).
  - Enhanced styling with `Colors.primary` and micro-animations from `react-native-reanimated`.

## Verification Plan

### Automated/Browser Verification
- Not applicable as it depends on API response and timer behavior.

### Manual Verification
- Start the onboarding flow and reach the results page.
- Verify that steps 1-4 appear sequentially with a checkmark after a delay.
- Verify that the last step stays in "loading" state until the AI plan is fetched and saved.
- Verify that the screen transitions smoothly to the results grid once everything is ready.
- Check that the UI is responsive and looks premium on the dark background.
