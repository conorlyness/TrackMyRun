let analyticsQueries = {
  distanceByDay: `SELECT
        CASE DATEPART(WEEKDAY, RunDate)
            WHEN 1 THEN 'Sunday'
            WHEN 2 THEN 'Monday'
            WHEN 3 THEN 'Tuesday'
            WHEN 4 THEN 'Wednesday'
            WHEN 5 THEN 'Thursday'
            WHEN 6 THEN 'Friday'
            WHEN 7 THEN 'Saturday'
        END as DayOfWeek,
        SUM(CAST(Distance AS decimal(5, 2))) as TotalMiles
        FROM
            dbo.RunLog
        GROUP BY
            DATEPART(WEEKDAY, RunDate)
        ORDER BY
            DayOfWeek;`,

  totalDistanceRan: `SELECT
        SUM(CAST(Distance AS decimal(5, 2))) as TotalDistance
        FROM
            dbo.RunLog
        WHERE 
            RunDate BETWEEN 
            (SELECT MIN(RunDate) FROM dbo.RunLog) AND 
            (SELECT MAX(RunDate) FROM dbo.RunLog)`,

  longestRun: `SELECT
        MAX(CAST(Distance AS decimal(5, 2))) as LongestRun
        FROM 
            dbo.RunLog
        WHERE 
            RunDate BETWEEN 
            (SELECT MIN(RunDate) FROM dbo.RunLog) AND 
            (SELECT MAX(RunDate) FROM dbo.RunLog)`,

  averageDistancePerDayMonthYear: `WITH
   monthlyData AS (
    SELECT 
        SUM(CAST(Distance AS decimal)) as TotalDistance
    FROM 
        dbo.RunLog
    WHERE 
        DATEPART(MONTH, RunDate) = {month} AND 
        DATEPART(YEAR, RunDate) = {year}
    )

    SELECT 
        TotalDistance / DAY(EOMONTH(CONVERT(DATE,CONVERT(NVARCHAR(4), {year}) + '-' + CONVERT(NVARCHAR(2), {month}) + '-1'))) as AverageDistancePerMonth
    FROM 
        monthlyData`,

  totalDistanceMonthYear: `SELECT 
    (SUM(CAST(Distance AS decimal(5,2)))) as TotalDistance
    FROM 
        dbo.RunLog
    WHERE 
        MONTH(RunDate) = {month} AND 
        YEAR(RunDate) = {year}`,

  totalDistanceSoFarThisWeek: `WITH
   weeklyData AS (
    SELECT 
        SUM(CAST(Distance AS decimal)) as TotalDistance
    FROM 
        dbo.RunLog
    WHERE 
        RunDate >= DATEADD(week, DATEDIFF(week, 0, GETDATE()), 0) 
        AND RunDate <= GETDATE()
        AND Distance is not null
    )
    SELECT 
        TotalDistance as TotalDistanceWeek
    FROM 
        weeklyData`,
};

module.exports = analyticsQueries;
