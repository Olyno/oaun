const fs = require('fs');

fs.readdir(`${__dirname}/components`, (err, files) => {
	if (err) throw err;
	const finalImports = [];
	const finalExports = [];
	const finalFile = [];
	for (let file of files) {
		if ( fs.lstatSync(`${__dirname}/components/${file}`).isDirectory() ) {
			files = fs.readdirSync(`${__dirname}/components/${file}`);
			for (let f of files) {
				if (/\w+Auth\.ts/gmui.test(f)) {
					finalImports.push(`import ${f.replace(/\.ts$/gmui, '')} from './components/${file}/${f.replace(/\.ts$/gmui, '')}'`);
					finalExports.push(f.replace(/\.ts$/gmui, ''))
				}
			}
		}
	}
	finalFile.push(finalImports.join('\n'));
	finalFile.push('\nexport { ' + finalExports.join(', ') + ' }')
	finalFile.push('export default { ' + finalExports.join(', ') + ' }')
	fs.writeFileSync(`${__dirname}/index.ts`, finalFile.join('\n'))
})