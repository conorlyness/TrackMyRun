let analyticsQueries = {
  distanceByDay: `SELECT 
    CASE 
    WHEN EXTRACT(DOW FROM "RunDate") = 0 THEN 'Sunday'
    WHEN EXTRACT(DOW FROM "RunDate") = 1 THEN 'Monday'
    WHEN EXTRACT(DOW FROM "RunDate") = 2 THEN 'Tuesday'
    WHEN EXTRACT(DOW FROM "RunDate") = 3 THEN 'Wednesday'
    WHEN EXTRACT(DOW FROM "RunDate") = 4 THEN 'Thursday'
    WHEN EXTRACT(DOW FROM "RunDate") = 5 THEN 'Friday'
    WHEN EXTRACT(DOW FROM "RunDate") = 6 THEN 'Saturday'
    END AS Day_Of_Week, 
    SUM(CAST("Distance" AS decimal(5, 2))) AS Total_Miles
    FROM 
    "RunLog"
    GROUP BY 
    EXTRACT(DOW FROM "RunDate")
    ORDER BY 
    Day_Of_Week;`,

  totalDistanceRan: `SELECT
    SUM(CAST("Distance" AS decimal(5, 2))) as Total_Distance
    FROM
    "RunLog"
    WHERE 
    "RunDate" BETWEEN 
    (SELECT MIN("RunDate") FROM "RunLog") AND 
    (SELECT MAX("RunDate") FROM "RunLog")`,

  longestRun: `SELECT
    MAX(CAST("Distance" AS decimal(5, 2))) as Longest_Run
    FROM 
    "RunLog"
    WHERE 
    "RunDate" BETWEEN 
    (SELECT MIN("RunDate") FROM "RunLog") AND 
    (SELECT MAX("RunDate") FROM "RunLog")`,

  averageDistancePerDayMonthYear: `WITH monthly_data AS (
    SELECT
    SUM(CAST("Distance" AS decimal)) AS total_distance
    FROM
    "RunLog"
    WHERE
    EXTRACT(MONTH FROM "RunDate") = {month} AND
    EXTRACT(YEAR FROM "RunDate") = {year}
    )   
    SELECT
    total_distance / EXTRACT(DAY FROM (date_trunc('month', TO_TIMESTAMP(CONCAT({year}, '-', {month}, '-01'), 'YYYY-MM-DD')) + INTERVAL '1 month' - INTERVAL '1 day')) AS average_Daily_Distance_Month_Year
    FROM
    monthly_data;`,

  totalDistanceMonthYear: `SELECT
    SUM(CAST("Distance" AS decimal)) AS total_distance
    FROM
    "RunLog"
    WHERE
    EXTRACT(MONTH FROM "RunDate") = {month} AND
    EXTRACT(YEAR FROM "RunDate") = {year};`,

  totalDistanceSoFarThisWeek: `WITH weekly_data AS (
    SELECT 
    SUM(CAST("Distance" AS decimal(5,2))) AS total_distance
    FROM 
    "RunLog"
    WHERE
    "RunDate" >= date_trunc('week', NOW())::date
    AND 
    "RunDate" <= NOW()::date
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
    COALESCE(SUM("Distance"::decimal), 0) AS TotalDistance
    FROM months
    LEFT JOIN "RunLog"
    ON months.month = date_trunc('month', "RunDate")
    GROUP BY to_char(months.month, 'Month'), months.month
    ORDER BY months.month ASC
    )

    SELECT *
    FROM monthly_data;
    `,
};

module.exports = analyticsQueries;
