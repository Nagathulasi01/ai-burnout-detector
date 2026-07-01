def get_insights(data):
    # Legacy outputs
    reasons = []
    solutions = []

    # New structured outputs
    factors_map = []
    categorized_insights = {
        "Sleep Recovery": [],
        "Workload Balance": [],
        "Screen Time Management": [],
        "Physical Recovery": [],
        "Stress Regulation": [],
        "Deadline Planning": []
    }
    
    recommendation_plan = {
        "today": [],
        "this_week": [],
        "long_term": []
    }

    if data["sleep_hours"] <= 2:
        reason = "Low sleep may be increasing emotional exhaustion."
        solution = "Try sleeping 6-7 hours and avoid screens 30 minutes before bed."
        reasons.append(reason)
        solutions.append(solution)
        factors_map.append(("Low sleep quality", 3)) # weight
        categorized_insights["Sleep Recovery"].append(solution)
        recommendation_plan["today"].append("Go to bed 30 minutes earlier than usual tonight.")
        recommendation_plan["this_week"].append("Aim for at least 6 hours of sleep each night.")
        recommendation_plan["long_term"].append("Establish a strict digital sunset rule 1 hour before sleep.")

    if data["work_hours"] >= 4:
        reason = "High study/work hours may be increasing mental strain."
        solution = "Use 25-30 minute study blocks with 5-minute breaks."
        reasons.append(reason)
        solutions.append(solution)
        factors_map.append(("High workload", 2))
        categorized_insights["Workload Balance"].append(solution)
        recommendation_plan["today"].append("Take a strict 15-minute complete disconnect break today.")
        recommendation_plan["this_week"].append("Implement the Pomodoro technique for all deep work.")
        recommendation_plan["long_term"].append("Set firm boundaries on working hours to prevent chronic fatigue.")

    if data["screen_time"] >= 3:
        reason = "High non-study screen time may be affecting recovery."
        solution = "Take screen-free breaks and reduce scrolling before sleep."
        reasons.append(reason)
        solutions.append(solution)
        factors_map.append(("High screen time", 2))
        categorized_insights["Screen Time Management"].append(solution)
        recommendation_plan["today"].append("Replace 20 minutes of scrolling with a screen-free activity.")
        recommendation_plan["this_week"].append("Set app timers on your most used social media apps.")
        recommendation_plan["long_term"].append("Create screen-free zones in your home, like the bedroom.")

    if data["physical_activity"] <= 2:
        reason = "Low physical activity may reduce stress resilience."
        solution = "Add a 20-minute walk or light exercise daily."
        reasons.append(reason)
        solutions.append(solution)
        factors_map.append(("Low physical activity", 2))
        categorized_insights["Physical Recovery"].append(solution)
        recommendation_plan["today"].append("Do a 5-minute stretching routine right now or before bed.")
        recommendation_plan["this_week"].append("Schedule three 20-minute walks this week.")
        recommendation_plan["long_term"].append("Find a physical activity you genuinely enjoy and make it a habit.")

    if data["deadline_pressure"] >= 3:
        reason = "High deadline pressure may be increasing anxiety."
        solution = "Break tasks into smaller steps and finish one small task first."
        reasons.append(reason)
        solutions.append(solution)
        factors_map.append(("High deadline pressure", 3))
        categorized_insights["Deadline Planning"].append(solution)
        recommendation_plan["today"].append("Write down your top 3 priorities for tomorrow.")
        recommendation_plan["this_week"].append("Use a calendar to visually block out time for upcoming deadlines.")
        recommendation_plan["long_term"].append("Adopt a task management system to offload mental tracking.")

    if data["stress_level"] >= 6:
        reason = "Stress level is high."
        solution = "Try deep breathing, journaling, or talking to someone you trust."
        reasons.append(reason)
        solutions.append(solution)
        factors_map.append(("High stress level", 4))
        categorized_insights["Stress Regulation"].append(solution)
        recommendation_plan["today"].append("Do a 2-minute box breathing exercise (inhale 4s, hold 4s, exhale 4s, hold 4s).")
        recommendation_plan["this_week"].append("Spend at least 30 minutes doing an activity that brings you joy.")
        recommendation_plan["long_term"].append("Consider integrating regular mindfulness practices or therapy into your routine.")

    if not reasons:
        reasons.append("No major burnout trigger detected from the inputs.")
        solutions.append("Maintain your current healthy routine and keep tracking weekly.")
        recommendation_plan["today"].append("Acknowledge your good habits today.")
        recommendation_plan["this_week"].append("Continue tracking to ensure stability.")
        recommendation_plan["long_term"].append("Focus on gradual growth and maintaining your healthy baseline.")

    # Sort factors by weight descending
    factors_map.sort(key=lambda x: x[1], reverse=True)
    top_factors = [f[0] for f in factors_map[:3]]

    # Generate risk summary
    if len(top_factors) > 0:
        risk_summary = f"Your burnout risk appears mainly influenced by {', '.join(top_factors).lower()}."
    else:
        risk_summary = "Your burnout risk appears low based on your current inputs."

    return {
        "reasons": reasons,
        "solutions": solutions,
        "top_factors": top_factors,
        "categorized_insights": categorized_insights,
        "recommendation_plan": recommendation_plan,
        "risk_summary": risk_summary
    }

def get_reason_and_solution(data):
    # Legacy wrapper if needed by other parts, but we'll use get_insights directly
    insights = get_insights(data)
    return insights["reasons"], insights["solutions"]
