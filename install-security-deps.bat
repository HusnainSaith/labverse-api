@echo off
echo Installing security dependencies...
npm install helmet express-rate-limit
npm install --save-dev @types/helmet
echo Security dependencies installed successfully!