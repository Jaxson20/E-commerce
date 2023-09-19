const fs = require('fs');
const inquirer = require('inquirer');
const svg2png = require('svg2png');

async function createLogo() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'text',
            message: 'Enter up to three characters:',
            validate: function (input) {
                return /^[a-zA-Z0-9]{1,3}$/.test(input) ? true : 'You can enter up to three alphanumeric characters.';
            }
        },
        {
            type: 'input',
            name: 'textColor',
            message: 'Enter text color (color keyword or hexadecimal):'
        },
        {
            type: 'list',
            name: 'shape',
            message: 'Choose a shape:',
            choices: ['circle', 'triangle', 'square']
        },
        {
            type: 'input',
            name: 'shapeColor',
            message: 'Enter shape color (color keyword or hexadecimal):'
        }
    ]);

    const { text, textColor, shape, shapeColor } = answers;

    // Calculate text position based on the shape
    const textPosition = calculateTextPosition(shape);

    // Create an SVG string
    const svg = `
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
            <!-- Add shape -->
            ${createShape(shape, shapeColor)}
            
            <!-- Add text -->
            <text x="${textPosition.x}" y="${textPosition.y}" fill="${textColor}" font-size="24" text-anchor="middle" alignment-baseline="middle">${text}</text>
        </svg>
    `;

    // Convert SVG to PNG
    const pngBuffer = await svg2png(svg);
    
    // Save the PNG file
    fs.writeFileSync('logo.png', pngBuffer);
    console.log('Generated logo.png');
}

function calculateTextPosition(shape) {
    switch (shape.toLowerCase()) {
        case 'circle':
            return { x: 160, y: 100 };
        case 'triangle':
            return { x: 200, y: 100 };
        case 'square':
            return { x: 200, y: 100 };
        default:
            return { x: 160, y: 100 };
    }
}

function createShape(shape, shapeColor) {
    switch (shape.toLowerCase()) {
        case 'circle':
            return `<circle cx="160" cy="100" r="80" fill="${shapeColor}" />`;
        case 'triangle':
            return `<polygon points="200,20 240,180 160,180" fill="${shapeColor}" />`;
        case 'square':
            return `<rect x="80" y="20" width="160" height="160" fill="${shapeColor}" />`;
        default:
            return '';
    }
}

createLogo();





