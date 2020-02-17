const electron = window.require('electron');
const path = electron.remote.require('path');
const fs = electron.remote.require('fs');

const useFileSystem = (opts) => {
  const userDataPath = (electron.app || electron.remote.app).getPath('userData');
  const userPath = path.join(userDataPath, 'user-preferences.json');

  const parseDataFile = (filePath) => {
    try {
      return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
      return null;
    }
  }
  
  const get = (key) => {
    const userData = parseDataFile(userPath);
    return userData ? userData[key] : null;
  }

  const set = (key, val) => {
    // If there is no data yet, we set from defaults defined
    // in the hook params
    const userData = parseDataFile(userPath);
    if (userData) {
      const newUserData = { ...userData, [key]: val }
      fs.writeFileSync(userPath, JSON.stringify(newUserData));
    } else if (!userData && opts) {
      const updatedDefault = { ...opts.defaults, [key]: val }
      fs.writeFileSync(userPath, JSON.stringify(updatedDefault));
    } else {
      console.error('useFileSystem: couldn\'t set params, try to define a default first')
    }
  }

return [get, set];
}

export default useFileSystem
