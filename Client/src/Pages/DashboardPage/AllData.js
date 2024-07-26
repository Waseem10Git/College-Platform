const transformedData = {
    barChartData: {
        // For bar chart (e.g., course enrollments)
        mostEnrolledCourses: [
            { courseName: "Mathematics", enrollments: 120 },
            { courseName: "Physics", enrollments: 80 },
            { courseName: "Chemistry", enrollments: 60 },
            { courseName: "Biology", enrollments: 100 }
        ],
        doctorCourses: [
            { doctor: "Dr. Smith", courses: 5 },
            { doctor: "Dr. Johnson", courses: 3 },
            { doctor: "Dr. Sara", courses: 9 },
            { doctor: "Dr. Tema", courses: 4 },
            { doctor: "Dr. Jones", courses: 6 },
            { doctor: "Dr. Alaa", courses: 5 },
            { doctor: "Dr. Ahmed", courses: 7 }
        ]
    },
    lineChartData: {
        // For line chart (e.g., enrollments over time)
        courseEnrollmentsOverTime: [
            { date: "2024-01-01", enrollments: 50 },
            { date: "2024-02-01", enrollments: 75 },
            { date: "2024-03-01", enrollments: 60 },
            { date: "2024-04-01", enrollments: 90 },
            { date: "2024-05-01", enrollments: 80 },
            { date: "2024-05-04", enrollments: 70 },
            { date: "2024-05-07", enrollments: 85 },
            { date: "2024-06-01", enrollments: 60 },
            { date: "2024-06-10", enrollments: 40 },
            { date: "2024-06-20", enrollments: 70 },
            { date: "2024-07-03", enrollments: 70 },
            { date: "2024-07-15", enrollments: 83 },
            { date: "2024-07-31", enrollments: 68 },
            { date: "2024-08-09", enrollments: 90 },
            { date: "2024-09-10", enrollments: 20 },
            { date: "2024-10-01", enrollments: 75 },
            { date: "2024-10-24", enrollments: 65 },
            { date: "2024-11-07", enrollments: 35 },
            { date: "2024-12-01", enrollments: 45 }
        ],
        absenceRates: [
            { date: "2022-01-01", absenceRate: 20 },
            { date: "2022-02-01", absenceRate: 25 },
            { date: "2022-03-01", absenceRate: 15 },
            { date: "2022-04-01", absenceRate: 10 },
            { date: "2022-05-01", absenceRate: 7 },
            { date: "2022-06-01", absenceRate: 25 },
            { date: "2022-07-01", absenceRate: 90 },
            { date: "2022-08-01", absenceRate: 85 },
            { date: "2022-09-01", absenceRate: 55 },
            { date: "2022-10-01", absenceRate: 20 },
            { date: "2022-11-01", absenceRate: 18 },
            { date: "2022-12-01", absenceRate: 15 }
        ]
    },
    pieChartData: [
        { courseName: "Mathematics", enrollments: 120 },
        { courseName: "Physics", enrollments: 80 },
        { courseName: "Chemistry", enrollments: 60 },
        { courseName: "Biology", enrollments: 100 }
    ],
    scatterPlotData: [
        { x: 50, y: 20 },
        { x: 75, y: 25 },
        { x: 60, y: 15 },
        { x: 90, y: 10 },
        { x: 80, y: 7 },
        { x: 70, y: 25 },
        { x: 85, y: 90 },
        { x: 60, y: 85 },
        { x: 40, y: 55 },
        { x: 70, y: 20 },
        { x: 70, y: 18 },
        { x: 83, y: 15 }
    ]
};
