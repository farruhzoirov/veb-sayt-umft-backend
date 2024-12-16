// const axios = require('axios');
// const Language = require('../../models/settings/language.model');
// const Department = require('../../models/data/department.model');
// const DepartmentTranslate = require('../../models/translate/department.model');
// const cron = require('node-cron');
// const config = require('../../config/config');
//
// const integrationDepartmentSchedule = cron.schedule('* * * * *', async () => {
//   let limit = 200;
//   let page = 0;
//   let pageCount = 0;
//
//   const fetchDepartments = async () => {
//     try {
//
//       const response = await axios.get(`https://hemisapi.umft.uz/department-list?page=${page}&limit=${limit}`, {
//         headers: {
//           Authorization: `Bearer ${config.HEMIS_API_TOKEN}`
//         }
//       });
//
//       const data = response.data;
//
//       for (let department of data.data) {
//         if (department) {
//           // Here we can add logic to save the department in the database
//         }
//       }
//       console.log('Page count', data.pagination.pageCount);
//       pageCount = data.pagination.pageCount || 1;
//       console.log(`Processed page ${page + 1} of ${pageCount}`);
//
//       page++;
//       if (page < pageCount) {
//         setTimeout(fetchDepartments, 1000); // Delay next page fetch by 1 second
//       } else {
//         console.log('Sync departments finished');
//       }
//     } catch (err) {
//       console.error(`Error fetching departments on page ${page}:`, err.message);
//     }
//   };
//
//   await fetchDepartments();
// });
//
// integrationDepartmentSchedule.start();
