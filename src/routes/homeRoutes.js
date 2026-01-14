const express = require('express');
const router = express.Router();
const { insightControllers } = require('../controllers');

/* ===============================
   HOME
   =============================== */

router.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Home',
    activeMenu: 'home',
  });
});

/* ===============================
   STATIC PAGES
   =============================== */

router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About Us',
    activeMenu: 'about',
  });
});

router.get('/privacy', (req, res) => {
  res.render('pages/privacy', {
    title: 'Privacy Policy',
    activeMenu: 'privacy',
  });
});

router.get('/terms', (req, res) => {
  res.render('pages/terms', {
    title: 'Terms & Conditions',
    activeMenu: 'terms',
  });
});

/* ===============================
   INSIGHTS
   =============================== */

router.get('/insights', insightControllers.renderInsights);
router.get('/insights/:slug', insightControllers.renderInsightDetail);

/* ===============================
   AUTH PAGES
   =============================== */

router.get('/sign-in', (req, res) => {
  res.render('pages/signin', {
    title: 'Sign In',
    activeMenu: '',
  });
});

module.exports = router;
