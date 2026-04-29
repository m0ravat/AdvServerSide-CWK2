import { execSync } from 'child_process';

try {
  console.log('Pulling latest changes from main...');
  execSync('git pull origin main', {
    cwd: '/vercel/share/v0-project',
    stdio: 'inherit'
  });
  console.log('Successfully pulled latest changes');
} catch (error) {
  console.error('Error pulling changes:', error.message);
}
