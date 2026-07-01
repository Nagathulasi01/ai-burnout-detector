def get_reason_and_solution(data):
    reasons = []
    solutions = []

    # Sleep
    if data["sleep_hours"] <= 2:
        reasons.append("Low sleep is increasing mental exhaustion")
        solutions.append("Try sleeping at least 6–7 hours daily")

    # Work load
    if data["work_hours"] >= 4:
        reasons.append("High workload is contributing to stress")
        solutions.append("Reduce workload or take structured breaks")

    # Screen time
    if data["screen_time"] >= 3:
        reasons.append("Excessive screen time is affecting mental health")
        solutions.append("Limit screen time and take eye/mental breaks")

    # Physical activity
    if data["physical_activity"] <= 2:
        reasons.append("Low physical activity is reducing stress resilience")
        solutions.append("Add at least 20–30 min physical activity daily")

    # Deadline pressure
    if data["deadline_pressure"] >= 3:
        reasons.append("High deadline pressure is causing anxiety")
        solutions.append("Plan tasks earlier and break work into smaller parts")

    # Stress level
    if data["stress_level"] >= 6:
        reasons.append("High stress levels detected")
        solutions.append("Practice relaxation techniques like breathing or meditation")

    return reasons, solutions
