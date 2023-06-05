let analyticsQueries = {
  distanceByDay: `SELECT 
    CASE 
    WHEN EXTRACT(DOW FROM "rundate") = 0 THEN 'Sunday'
    WHEN EXTRACT(DOW FROM "rundate") = 1 THEN 'Monday'
    WHEN EXTRACT(DOW FROM "rundate") = 2 THEN 'Tuesday'
    WHEN EXTRACT(DOW FROM "rundate") = 3 THEN 'Wednesday'
    WHEN EXTRACT(DOW FROM "rundate") = 4 THEN 'Thursday'
    WHEN EXTRACT(DOW FROM "rundate") = 5 THEN 'Friday'
    WHEN EXTRACT(DOW FROM "rundate") = 6 THEN 'Saturday'
    END AS Day_Of_Week, 
    SUM(CAST("distance" AS decimal(5, 2))) AS Total_Miles
    FROM 
    public.runlog
    GROUP BY 
    EXTRACT(DOW FROM "rundate")
    ORDER BY 
    Day_Of_Week;`,

  totalDistanceRan: `SELECT
    SUM(CAST("distance" AS decimal(5, 2))) as Total_Distance
    FROM
    public.runlog
    WHERE 
    "rundate" BETWEEN 
    (SELECT MIN("rundate") FROM public.runlog) AND 
    (SELECT MAX("rundate") FROM public.runlog)`,

  longestRun: `SELECT
    MAX(CAST("distance" AS decimal(5, 2))) as Longest_Run
    FROM 
    public.runlog
    WHERE 
    "rundate" BETWEEN 
    (SELECT MIN("rundate") FROM public.runlog) AND 
    (SELECT MAX("rundate") FROM public.runlog)`,

  averageDistancePerDayMonthYear: `WITH monthly_data AS (
    SELECT
    SUM(CAST("distance" AS decimal)) AS total_distance
    FROM
    public.runlog
    WHERE
    EXTRACT(MONTH FROM "rundate") = {month} AND
    EXTRACT(YEAR FROM "rundate") = {year}
    )   
    SELECT
    total_distance / EXTRACT(DAY FROM (date_trunc('month', TO_TIMESTAMP(CONCAT({year}, '-', {month}, '-01'), 'YYYY-MM-DD')) + INTERVAL '1 month' - INTERVAL '1 day')) AS average_Daily_Distance_Month_Year
    FROM
    monthly_data;`,

  totalDistanceMonthYear: `SELECT
    SUM(CAST("distance" AS decimal)) AS total_distance
    FROM
    public.runlog
    WHERE
    EXTRACT(MONTH FROM "rundate") = {month} AND
    EXTRACT(YEAR FROM "rundate") = {year};`,

  totalDistanceSoFarThisWeek: `WITH weekly_data AS (
    SELECT 
    SUM(CAST("distance" AS decimal(5,2))) AS total_distance
    FROM 
    public.runlog
    WHERE
    "rundate" >= date_trunc('week', NOW())::date
    AND 
    "rundate" <= NOW()::date
    )
    SELECT 
    total_distance AS Total_Distance_Week
    FROM 
    weekly_data;`,

  TotalDistanceLast6Months: `WITH months AS (
    SELECT generate_series(date_trunc('month', CURRENT_DATE) - interval '5 months',
    date_trunc('month', CURRENT_DATE),
    '1 month') AS month
    ),

    monthly_data AS (
    SELECT to_char(months.month, 'Month') AS Month,
    COALESCE(SUM("distance"::decimal), 0) AS TotalDistance
    FROM months
    LEFT JOIN public.runlog
    ON months.month = date_trunc('month', "rundate")
    GROUP BY to_char(months.month, 'Month'), months.month
    ORDER BY months.month ASC
    )

    SELECT *
    FROM monthly_data;
    `,
};

module.exports = analyticsQueries;
