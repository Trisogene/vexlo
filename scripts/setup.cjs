
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

async function main() {
	console.clear();

	const nodeModulesPath = path.join(process.cwd(), 'node_modules');
	const promptsPath = path.join(nodeModulesPath, 'prompts');
	const hasModules = fs.existsSync(promptsPath);

	if (!hasModules) {
		console.log("⚡ Bootstrapping Project Setup...");
		console.log("📦 Installing dependencies to enable the wizard (this may take a moment)...");
		let packageManager = 'pnpm';
		try {
			// Check for pnpm
			execSync('pnpm --version', { stdio: 'ignore' });
			console.log('✔ pnpm detected');
		} catch {
			console.log('pnpm not found. Attempting to install pnpm globally using npm...');
			try {
				execSync('npm i -g pnpm', { stdio: 'inherit' });
				console.log('✔ pnpm installed');
			} catch {
				console.log('Could not install pnpm globally. Falling back to npm for dependency installation.');
				packageManager = 'npm';
			}
		}

		try {
			if (packageManager === 'pnpm') {
				execSync('pnpm install', { stdio: 'inherit' });
			} else {
				execSync('npm install', { stdio: 'inherit' });
			}
			console.log("✅ Dependencies installed. Starting wizard...\n");
		} catch {
			console.error("❌ Failed to install dependencies. Please run 'npm install' or 'pnpm install' manually.");
			process.exit(1);
		}
	}

	// Now that modules are installed, we use dynamic import() 
	// because these libraries might be ESM-only (like ora/boxen).
	let prompts, pc, ora, boxen;
	try {
		prompts = (await import('prompts')).default;
		pc = (await import('picocolors')).default;
		ora = (await import('ora')).default;
		boxen = (await import('boxen')).default;
	} catch {
		// Fallback or retry if import fails right after install (unlikely)
		console.log("🛠 Finalizing environment...");
		process.exit(1);
	}

	console.log(boxen(pc.cyan(pc.bold(' 🌌  VEXLO ')), {
		padding: 1,
		margin: 1,
		borderStyle: 'round',
		borderColor: 'cyan',
		textAlignment: 'center'
	}));

	console.log(pc.gray(`    The simplest, most effective stack for vibe coding.\n`));

	const envPath = path.join(process.cwd(), '.env');
	const envExamplePath = path.join(process.cwd(), '.env.example');

	if (!fs.existsSync(envPath)) {
		const { createEnv } = await prompts({
			type: 'confirm',
			name: 'createEnv',
			message: 'No .env file found. Create one from defaults?',
			initial: true
		});

		if (createEnv && fs.existsSync(envExamplePath)) {
			fs.copyFileSync(envExamplePath, envPath);
			const spinner = ora('Creating .env file...').start();
			await new Promise(r => setTimeout(r, 500));
			spinner.succeed('Created .env file');
		}
	} else {
		console.log(pc.green('✔ .env file checked'));
	}

	const { dbChoice } = await prompts({
		type: 'select',
		name: 'dbChoice',
		message: 'How would you like to run the database?',
		choices: [
			{ title: 'Local (Docker)', description: 'Runs Supabase locally via Docker', value: 'local' },
			{ title: 'Remote (Cloud)', description: 'Connect to a project on Supabase.com', value: 'remote' },
			{ title: 'Skip', description: 'I will configure it later', value: 'skip' }
		],
		initial: 0
	});

	if (dbChoice === 'local') {
		const spinner = ora('Checking Docker status...').start();
		let isDockerRunning = false;
		try {
			// Check if Docker CLI is installed
			execSync('docker -v', { stdio: 'ignore' });

			// Check if Docker Daemon is running
			try {
				execSync('docker info', { stdio: 'ignore' });
				spinner.succeed('Docker is installed and running');
				isDockerRunning = true;
			} catch {
				spinner.warn('Docker is installed but the DAEMON is not running.');
				console.log(pc.yellow('\n⚠ Please start Docker Desktop and try again.\n'));

				const { continueAnyway } = await prompts({
					type: 'confirm',
					name: 'continueAnyway',
					message: 'Continue without starting the local database?',
					initial: false
				});

				if (!continueAnyway) process.exit(0);
			}

			if (isDockerRunning) {
				// If Supabase is already running locally (started previously), update .env and skip start prompt					let supabaseStartedSuccessfully;					let isSupabaseRunning = false;
				try {
					execSync('npx supabase status', { stdio: 'ignore' });
					isSupabaseRunning = true;
					supabaseStartedSuccessfully = true;
					const spinnerEnvCheck = ora('Detected local Supabase, updating .env...').start();
					if (fs.existsSync(envPath)) {
						let envContent = fs.readFileSync(envPath, 'utf8');
						envContent = envContent.replace(/VITE_SUPABASE_URL=.*/, 'VITE_SUPABASE_URL=http://127.0.0.1:54321');
						if (!/VITE_SUPABASE_ANON_KEY=/.test(envContent) || envContent.includes('YOUR_SUPABASE_ANON_KEY')) {
							envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.*/, 'VITE_SUPABASE_ANON_KEY=your-local-anon-key');
						}
						fs.writeFileSync(envPath, envContent);
					}
					spinnerEnvCheck.succeed('Updated .env to point to local Supabase');
				} catch {
					// supabase not running or detection failed; will prompt to start
				}

				if (isSupabaseRunning) {
					console.log(pc.green('\n✔ Supabase services are already running locally. Skipping start.\n'));
				} else {
					const { startSupabase } = await prompts({
						type: 'confirm',
						name: 'startSupabase',
						message: 'Start Supabase services now? (Takes a few mins)',
						initial: true
					});
					if (startSupabase) {
						const projectName = path.basename(process.cwd());

						const runStart = async () => {
							console.log(pc.cyan('\n🚀 Starting Supabase services...\n'));
							const startResult = spawnSync('npx', ['supabase', 'start'], { stdio: 'inherit', shell: true });

							if (startResult.status !== 0) {
								throw new Error("Supabase start failed");
							}

							const healthSpinner = ora('Verifying Supabase health...').start();

							// Health check loop
							let isHealthy = false;
							let attempts = 0;
							const maxAttempts = 40;

							while (!isHealthy && attempts < maxAttempts) {
								try {
									execSync('npx supabase status', { stdio: 'pipe' });
									isHealthy = true;
								} catch (e) {
									healthSpinner.fail('Supabase is having trouble starting.');
									return await triggerRecovery(errorOutput);
								}

								healthSpinner.text = pc.yellow(`Waiting for services to be active... Attempt ${attempts}/${maxAttempts}`);
								await new Promise(r => setTimeout(r, 1500));
							}
						}

						if (isHealthy) {
							healthSpinner.succeed('Supabase is ready and healthy!');
						} else {
							healthSpinner.warn('Supabase services are taking too long to start.');
						}
						return isHealthy; // Indicate if healthy or not
					};

					const triggerRecovery = async (errorOutput) => {
						console.log(pc.red(`\n❌ Error detected: ${errorOutput.trim()}\n`));

						const { retryForce } = await prompts({
							type: 'select',
							name: 'retryForce',
							message: 'What would you like to do?',
							choices: [
								{ title: 'Force Stop & Restart (Aggressive Clean)', value: 'restart' },
								{ title: 'Skip Database', value: 'skip' },
								{ title: 'Exit', value: 'exit' }
							]
						});

						if (retryForce === 'restart') {
							console.log(pc.yellow('\n🧹 Performing Aggressive Cleanup...'));

							// 1. Regular stop
							spawnSync('npx', ['supabase', 'stop', '--no-backup'], { stdio: 'inherit', shell: true });

							// 2. Manual container removal by project label
							try {
								console.log(pc.gray(`🔍 Cleaning up containers for project: ${projectName}...`));
								const containers = execSync(`docker ps -aq --filter label=com.supabase.cli.project=${projectName}`, { encoding: 'utf8' }).trim();
								if (containers) {
									console.log(pc.yellow('🗑 Removing conflicting containers...'));
									execSync(`docker rm -f ${containers.split(/\s+/).join(' ')}`, { stdio: 'ignore' });
								}
							} catch { }

							// 3. Network cleanup
							try {
								console.log(pc.gray('� Cleaning up Docker networks...'));
								execSync(`docker network prune -f --filter label=com.supabase.cli.project=${projectName}`, { stdio: 'ignore' });
							} catch { }

							console.log(pc.cyan('\n🚀 Retrying start...\n'));
							return await runStart();
						} else if (retryForce === 'exit') {
							process.exit(1);
						}
						return false; // User chose to skip
					};

					supabaseStartedSuccessfully = false;
					try {
						supabaseStartedSuccessfully = await runStart();
					} catch {
						supabaseStartedSuccessfully = await triggerRecovery(e.message || "Unknown error during start");
					}

					if (!supabaseStartedSuccessfully) {
						const { forceDev } = await prompts({
							type: 'confirm',
							name: 'forceDev',
							message: 'Start local server anyway?',
							initial: true
						});
						if (!forceDev) process.exit(0);
					}
				}
			}

		} catch {
			spinner.fail('Docker not found. Please install Docker for local development.');
			const { forceContinueNoDocker } = await prompts({
				type: 'confirm',
				name: 'forceContinueNoDocker',
				message: 'Continue anyway?',
				initial: false
			});
			if (!forceContinueNoDocker) process.exit(1);
		}		// If Supabase started locally, ensure .env points to the local Supabase URL
		if (typeof supabaseStartedSuccessfully !== 'undefined' && supabaseStartedSuccessfully) {
			try {
				const spinnerEnv = ora('Updating .env for local Supabase...').start();
				if (fs.existsSync(envPath)) {
					let envContent = fs.readFileSync(envPath, 'utf8');
					envContent = envContent.replace(/VITE_SUPABASE_URL=.*/, 'VITE_SUPABASE_URL=http://localhost:54321');
					if (!/VITE_SUPABASE_ANON_KEY=/.test(envContent) || envContent.includes('YOUR_SUPABASE_ANON_KEY')) {
						envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.*/, 'VITE_SUPABASE_ANON_KEY=your-local-anon-key');
					}
					fs.writeFileSync(envPath, envContent);
				}
				spinnerEnv.succeed('Updated .env to point to local Supabase');
			} catch {
				console.log(pc.yellow('Could not update .env automatically. Please set VITE_SUPABASE_URL=http://localhost:54321 manually.'));
			}
		}
	} else if (dbChoice === 'remote') {
		console.log(pc.yellow('\nℹ Please create a project on https://supabase.com first.\n'));

		const response = await prompts([
			{
				type: 'text',
				name: 'url',
				message: 'Enter your Supabase Project URL:',
				validate: value => value.includes('supabase.co') ? true : 'Invalid URL'
			},
			{
				type: 'password',
				name: 'key',
				message: 'Enter your Supabase Anon Key:',
				validate: value => value.length > 20 ? true : 'Key looks too short'
			}
		]);

		if (response.url && response.key) {
			const spinner = ora('Updating .env...').start();
			let envContent = fs.readFileSync(envPath, 'utf8');
			envContent = envContent.replace(/VITE_SUPABASE_URL=.*/, `VITE_SUPABASE_URL=${response.url}`);
			envContent = envContent.replace(/VITE_SUPABASE_ANON_KEY=.*/, `VITE_SUPABASE_ANON_KEY=${response.key}`);
			fs.writeFileSync(envPath, envContent);
			await new Promise(r => setTimeout(r, 500));
			spinner.succeed('Updated .env with remote credentials');
		}
	}

	console.log('\n' + boxen(pc.green(` Setup Complete! Starting App... `), { borderStyle: 'double', borderColor: 'green' }));
	console.log(pc.cyan(`\nStarting development server (` + pc.bold('pnpm dev') + `)...\n`));

	spawnSync('pnpm', ['dev'], { stdio: 'inherit', shell: true });
}

main().catch(console.error);
