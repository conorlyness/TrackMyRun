const express = require('express');
const db = require('./db');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
var path = require('path');
var sqlite3 = require('sqlite3');
const app = express();
const API_PORT = 3001;

app.use(express.json());
app.use(cors());

const cloudDB = process.env.CLOUD_DB === 'true';
//uncomment when running server standalone and wishing to use cloud DB
// const cloudDB = true;

// if cloud flag passed we use that db instead
if (cloudDB) {
  console.log('Running in Cloud DB mode.');
  startServer(true);
} else {
  console.log('Running in Sqlite mode.');
  isDbCreated();
}

//API routes

app.get('/', function (req, res) {
  res.send('WELCOME TO TMR SERVER');
});

// express.static to make the images im the upload folder accessible
app.use(express.static('uploads'));
var allImages = [];

//path to which the images will be saved
const PATH = './uploads';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATH);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});
let upload = multer({
  storage: storage,
});

// POST File
app.post('/api/upload', upload.single('image'), function (req, res) {
  if (!req.file) {
    console.log('No file is available!');
    return res.send({
      success: false,
    });
  } else {
    console.log('File is available!');
    return res.status(200).send(req.file.filename);
  }
});

app.post('/addImageToDb', async (req, res) => {
  const imgToAdd = {
    url: req.body.filename,
    description: req.body.description,
    tags: req.body.tags,
  };

  const insertImg = db.addImage(imgToAdd);
  if (insertImg) {
    return res.status(201).json(insertImg);
  }
  res.status(404);
});

app.get('/allImages', async (req, res) => {
  allImages = [];
  res.set('Content-Type', 'image/jpeg');
  const imagesFromDb = await db.getAllImages();
  if (imagesFromDb.rows) {
    const allDbImages = imagesFromDb.rows;
    fs.readdirSync(PATH).forEach((file) => {
      allDbImages.forEach((imgObj) => {
        if (imgObj.url == file) {
          const filePath = 'http://localhost:3001/' + file;
          const img = {
            url: filePath,
            description: imgObj.description,
            tags: imgObj.tags,
          };
          allImages.push(img);
        }
      });
    });
    return res.status(201).json(allImages);
  }
});

app.get('/allRuns', async (req, res) => {
  console.log('calling /allRuns');
  const viewAllRuns = await db.viewAllRuns();
  if (viewAllRuns) {
    return res.status(201).json(viewAllRuns);
  }
  res.status(404);
});

app.get('/allPbs', async (req, res) => {
  console.log('calling /allPbs');
  const viewAllPbs = await db.getAllPersonalBests();
  if (viewAllPbs) {
    return res.status(201).json(viewAllPbs);
  }
  res.status(404);
});

app.post('/editPb', async (req, res) => {
  console.log('calling /editPb');
  const editPb = await db.editPersonalBest(req.body);
  if (editPb) {
    return res.status(201).json(editPb);
  }
  res.status(404);
});

app.post('/specificRuns', async (req, res) => {
  console.log('calling /specificRuns');
  const viewAllRuns = await db.viewallRunsInRange(req.body.start, req.body.end);
  if (viewAllRuns) {
    return res.status(201).json(viewAllRuns);
  }
  res.status(404);
});

app.post('/logRun', async (req, res) => {
  console.log('calling /logRun');
  const result = await db.logRun(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/editRun', async (req, res) => {
  console.log('calling /editRun');
  const result = await db.editRun(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/deleteRun', async (req, res) => {
  console.log('calling /deleteRun');
  const result = await db.deleteRun(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.get('/dayOfWeekDistance', async (req, res) => {
  console.log('calling /dayOfWeekDistance');
  const result = await db.sumOfRunsOnDaysOfWeek();

  if (result) {
    return res.status(200).json(result);
  }

  res.status(404);
});

app.post('/totalForMonthYear', async (req, res) => {
  console.log('calling /totalForMonthYear');
  const { month, year } = req.body;
  const result = await db.totalDistanceByMonthAndYear(month, year);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.post('/dailyAvgForMonthYear', async (req, res) => {
  console.log('calling /dailyAvgForMonthYear');
  const { month, year } = req.body;
  const result = await db.averageDistancePerDayInMonthAndYear(month, year);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/totalDistance', async (req, res) => {
  console.log('calling /totalDistance');
  const result = await db.totalDistanceRan();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/longestRun', async (req, res) => {
  console.log('calling /longestRun');
  const result = await db.longestRun();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/currentWeekTotal', async (req, res) => {
  console.log('calling /currentWeekTotal');
  const result = await db.totalDistanceThisCurrentWeek();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/last6MonthsTotal', async (req, res) => {
  console.log('calling /last6MonthsTotal');
  const result = await db.totalDistanceLast6Months();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/daysRanCurrentMonth', async (req, res) => {
  console.log('calling /daysRanCurrentMonth');
  const result = await db.totalDaysRanThisMonth();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.get('/allShoes', async (req, res) => {
  console.log('calling /allShoes');
  const result = await db.getAllShoes();
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.post('/addShoe', async (req, res) => {
  console.log('calling /addShoe');
  const result = await db.addNewShoes(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/increaseShoeDistance', async (req, res) => {
  console.log('calling /increaseShoeDistance');
  const result = await db.increaseShoeDistance(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/decreaseShoeDistance', async (req, res) => {
  console.log('calling /decreaseShoeDistance');
  const result = await db.decreaseShoeDistance(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/retire', async (req, res) => {
  console.log('calling /retire');
  const result = await db.retireShoe(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/reactivate', async (req, res) => {
  console.log('calling /reactivate');
  const result = await db.reactivateShoe(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/deleteShoe', async (req, res) => {
  console.log('calling /deleteShoe');
  const result = await db.deleteShoe(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

//all run schedule routes
app.post('/runSchedule', async (req, res) => {
  console.log('calling /runSchedule');
  const result = await db.getAllSchedule(req.body);
  if (result) {
    return res.status(200).json(result);
  }
  res.status(404);
});

app.post('/addSchedule', async (req, res) => {
  console.log('calling /addSchedule');
  const schedule = await db.scheduleRun(req.body);
  if (schedule) {
    return res.status(200).json(schedule);
  }
  res.status(404);
});

app.post('/editSchedule', async (req, res) => {
  console.log('calling /editSchedule');
  const result = await db.editSchedule(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/deleteSchedule', async (req, res) => {
  console.log('calling /deleteSchedule');
  const result = await db.deleteSchedule(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/markAsComplete', async (req, res) => {
  console.log('calling /markAsComplete');
  const result = await db.completeRun(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.post('/markAsIncomplete', async (req, res) => {
  console.log('calling /markAsIncomplete');
  const result = await db.markRunIncomplete(req.body);
  if (result) {
    return res.status(200).json(res.statusCode);
  }
  res.status(404);
});

app.get('/raceDays', async (req, res) => {
  console.log('calling /raceDays');
  const raceDays = await db.getRaceDays();
  if (raceDays) {
    return res.status(201).json(raceDays);
  }
  res.status(404);
});

function isDbCreated() {
  console.log('Checking file location for the database...');
  new sqlite3.Database(
    path.join(__dirname, 'tmr.db'),
    sqlite3.OPEN_READWRITE,
    async (err) => {
      if (err && err.code === 'SQLITE_CANTOPEN') {
        await createDatabaseWithRetry();
      } else if (err) {
        console.error('Error while accessing the database:', err);
      } else {
        console.log('Database is present');
        db.connectSqlite();
        startServer();
      }
    }
  );
}

async function createDatabaseWithRetry(retryCount = 3, delayMs = 1000) {
  if (retryCount === 0) {
    console.error('Database creation failed after multiple attempts');
    return;
  }

  console.log(`Attempting to create the database. Retries left: ${retryCount}`);

  try {
    await db.createDatabase();
    console.log('Database created successfully');
    startServer();
  } catch (error) {
    console.error('Creating the database failed:', error);
    await sleep(delayMs); // Wait for a specified delay before retrying
    await createDatabaseWithRetry(retryCount - 1, delayMs);
  }
}

function startServer(cloudDB = false) {
  app.listen(3001, () => {
    try {
      if (cloudDB) {
        console.log('ITS CLOUD DB');
        db.connect();
      }
      console.log(`listening on port ${API_PORT}`);
    } catch (err) {
      console.log('Error on port: ', err);
    }
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = app;
