/**
 * Vexlo Init Script
 * One-time initialization to make the project YOUR OWN
 * Run: pnpm run init (or npm run init)
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');
const readline = require('readline');

// Simple readline-based prompts (no dependencies needed)
function ask(question) {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise(resolve => {
		rl.question(question, answer => {
			rl.close();
			resolve(answer.trim().toLowerCase());
		});
	});
}

function printBanner() {
	console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🚀  V E X L O   I N I T I A L I Z A T I O N                    ║
║                                                                   ║
║   This will make the project YOUR OWN.                           ║
║   Run this ONCE after downloading/cloning.                       ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`);
}

function printSuccess() {
	console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   ✅  INITIALIZATION COMPLETE!                                   ║
║                                                                   ║
║   Your project is ready. Next steps:                             ║
║                                                                   ║
║   1. Run: pnpm run start                                         ║
║      (This will install dependencies, start the database,        ║
║       and launch the dev server)                                 ║
║                                                                   ║
║   2. Open: http://localhost:5173                                 ║
║                                                                   ║
║   3. Start vibe coding with Antigravity! 🎨                      ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`);
}

async function main() {
	console.clear();
	printBanner();

	const projectRoot = process.cwd();
	const gitDir = path.join(projectRoot, '.git');
	const envPath = path.join(projectRoot, '.env');
	const envExamplePath = path.join(projectRoot, '.env.example');

	// ─────────────────────────────────────────────────────────────
	// STEP 1: Handle Git
	// ─────────────────────────────────────────────────────────────
	console.log('📂 Step 1: Git Configuration\n');

	const hasGit = fs.existsSync(gitDir);

	if (hasGit) {
		// Check if there's an origin remote
		let hasOrigin = false;
		try {
			const remotes = execSync('git remote -v', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
			hasOrigin = remotes.includes('origin');
		} catch {
			// No git or error - that's fine
		}

		if (hasOrigin) {
			console.log('   Found existing git remote (origin).');
			const removeRemote = await ask('   Remove it to make this YOUR project? (Y/n): ');

			if (removeRemote !== 'n' && removeRemote !== 'no') {
				try {
					execSync('git remote remove origin', { stdio: 'pipe' });
					console.log('   ✅ Removed origin remote.\n');
				} catch (e) {
					console.log('   ⚠️  Could not remove remote. Continuing anyway.\n');
				}
			} else {
				console.log('   Keeping existing remote.\n');
			}
		} else {
			console.log('   ✅ Git is initialized, no remote to remove.\n');
		}
	} else {
		// No .git folder - downloaded as ZIP
		console.log('   No git repository found (downloaded as ZIP?).');
		const initGit = await ask('   Initialize a fresh git repository? (Y/n): ');

		if (initGit !== 'n' && initGit !== 'no') {
			try {
				execSync('git init', { stdio: 'pipe' });
				execSync('git add .', { stdio: 'pipe' });
				execSync('git commit -m "Initial commit from Vexlo"', { stdio: 'pipe' });
				console.log('   ✅ Git initialized with initial commit.\n');
			} catch (e) {
				console.log('   ⚠️  Git init failed. You can do this manually later.\n');
			}
		} else {
			console.log('   Skipping git initialization.\n');
		}
	}

	// ─────────────────────────────────────────────────────────────
	// STEP 2: Create .env file
	// ─────────────────────────────────────────────────────────────
	console.log('📄 Step 2: Environment Configuration\n');

	if (!fs.existsSync(envPath)) {
		if (fs.existsSync(envExamplePath)) {
			fs.copyFileSync(envExamplePath, envPath);
			console.log('   ✅ Created .env file from .env.example\n');
		} else {
			console.log('   ⚠️  No .env.example found. You may need to create .env manually.\n');
		}
	} else {
		console.log('   ✅ .env file already exists.\n');
	}

	// ─────────────────────────────────────────────────────────────
	// STEP 3: Show next steps
	// ─────────────────────────────────────────────────────────────
	printSuccess();

	// Optional: Ask if they want to run start now
	const runStart = await ask('Run "pnpm run start" now? (Y/n): ');

	if (runStart !== 'n' && runStart !== 'no') {
		console.log('\n🚀 Starting development environment...\n');
		spawnSync('pnpm', ['run', 'start'], { stdio: 'inherit', shell: true });
	} else {
		console.log('\nWhen ready, run: pnpm run start\n');
	}
}

main().catch(err => {
	console.error('❌ Error:', err.message);
	process.exit(1);
});
