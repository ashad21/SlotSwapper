const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting SlotSwapper development servers...\n');

// Function to run a command in a specific directory
function runCommand(command, args, cwd, name) {
  // Use .cmd extension on Windows
  const isWindows = process.platform === 'win32';
  const cmd = isWindows ? `${command}.cmd` : command;
  
  const childProcess = spawn(cmd, args, {
    cwd: cwd,
    stdio: 'inherit',
    shell: isWindows ? true : false
  });

  childProcess.on('error', (error) => {
    console.error(`❌ Error starting ${name}:`, error.message);
  });

  childProcess.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ ${name} exited with code ${code}`);
    }
  });

  return childProcess;
}

// Start backend server
console.log('📦 Starting backend server...');
const backend = runCommand('npm', ['run', 'dev'], path.join(__dirname, 'backend'), 'Backend');

// Wait a bit before starting frontend
setTimeout(() => {
  console.log('🎨 Starting frontend server...');
  const frontend = runCommand('npm', ['run', 'dev'], path.join(__dirname, 'frontend'), 'Frontend');
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down development servers...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down development servers...');
  process.exit(0);
});
