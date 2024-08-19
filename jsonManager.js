const fs = require('fs');
const readline = require('readline');

// Function to load and parse JSON file
function loadJSON(fileName) {
    try {
        const data = fs.readFileSync(fileName, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading or parsing ${fileName}:`, err);
        return null;
    }
}

// Function to save data to JSON file
function saveJSON(fileName, data) {
    try {
        fs.writeFileSync(fileName, JSON.stringify(data, null, 4), 'utf8');
        console.log(`Data successfully saved to ${fileName}`);
    } catch (err) {
        console.error(`Error writing to ${fileName}:`, err);
    }
}

// Function to display JSON data
function displayData(data) {
    if (data && data.length > 0) {
        data.forEach((item, index) => {
            console.log(`\nItem ${index + 1}:`);
            console.log(`  Name: ${item.Name}`);
            console.log(`  Amount: ${item.Amount}`);
            console.log(`  Link/Notes: ${item['Link/Notes']}`);
            console.log(`  Rank: ${item.Rank}`);
            console.log('\n--------------------------------');
        });
    } else {
        console.log('No data to display.');
    }
}

// Function to load preset data for a file
function loadPreset(fileName) {
    const presetFileName = fileName.replace('.json', '.presets.json');
    const presetData = loadJSON(presetFileName);
    return presetData || {};
}

// Function to add new entry to JSON file using a preset
function addEntry(fileName) {
    const data = loadJSON(fileName) || [];
    const preset = loadPreset(fileName);

    console.log('\nPreset Information:');
    console.log(preset);

    rl.question(`Enter Name (${preset.Name || ''}): `, (name) => {
        name = name || preset.Name || 'Default Name';
        rl.question(`Enter Amount (${preset.Amount || ''}): `, (amount) => {
            amount = amount || preset.Amount || '0';
            rl.question(`Enter Link/Notes (${preset['Link/Notes'] || ''}): `, (linkNotes) => {
                linkNotes = linkNotes || preset['Link/Notes'] || '';
                rl.question(`Enter Rank (VIP, SF_Services-TEAM, SF_Services-ACC, Partners, Standard) [${preset.Rank || 'Standard'}]: `, (rank) => {
                    rank = rank || preset.Rank || 'Standard';
                    const newEntry = {
                        Name: name,
                        Amount: amount,
                        'Link/Notes': linkNotes,
                        Rank: rank
                    };

                    data.push(newEntry);
                    saveJSON(fileName, data);
                    displayMenu();
                });
            });
        });
    });
}

// Setup console interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Load settings to get menu options
const settings = loadJSON('settings.json');
const menuOptions = settings.files;

// Function to display menu and handle user selection
function displayMenu() {
    console.log('\nSelect an option:');
    menuOptions.forEach((option, index) => {
        console.log(`${index + 1}. View ${option.name} Data`);
        console.log(`${index + 1 + menuOptions.length}. Add ${option.name} Entry`);
    });
    console.log('0. Exit');
    
    rl.question('\nEnter your choice: ', (choice) => {
        const selectedIndex = parseInt(choice) - 1;

        if (selectedIndex >= 0 && selectedIndex < menuOptions.length) {
            const selectedFile = menuOptions[selectedIndex].file;
            const data = loadJSON(selectedFile);
            displayData(data);
            displayMenu();  // Show menu again after displaying data
        } else if (selectedIndex >= menuOptions.length && selectedIndex < 2 * menuOptions.length) {
            const selectedFile = menuOptions[selectedIndex - menuOptions.length].file;
            addEntry(selectedFile);
        } else if (selectedIndex === -1) {
            rl.close();  // Exit the program
        } else {
            console.log('Invalid choice, please try again.');
            displayMenu();
        }
    });
}

// Start the program by displaying the menu
displayMenu();