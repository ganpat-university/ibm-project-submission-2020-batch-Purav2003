const CountHours = () => {
    const calculateDuration = (entry, exit_time) => {
        if (entry && exit_time) {
          // Split entry and exit times into components
          const entryComponents = entry.split(":");
          const exitComponents = exit_time.split(":");
      
          // Convert components to hours, minutes, and seconds
          const entryHours = parseInt(entryComponents[0], 10);
          const entryMinutes = parseInt(entryComponents[1], 10);
          const entrySeconds = parseFloat(entryComponents[2]);
          const exitHours = parseInt(exitComponents[0], 10);
          const exitMinutes = parseInt(exitComponents[1], 10);
          const exitSeconds = parseFloat(exitComponents[2]);
      
          // Calculate total seconds for entry and exit times
          const entryTotalSeconds = entryHours * 3600 + entryMinutes * 60 + entrySeconds;
          const exitTotalSeconds = exitHours * 3600 + exitMinutes * 60 + exitSeconds;
      
          // Calculate duration in seconds
          let durationInSeconds = exitTotalSeconds - entryTotalSeconds;
      
          // Convert duration to hours, minutes, and seconds
          const durationHours = Math.floor(durationInSeconds / 3600);
          durationInSeconds %= 3600;
          const durationMinutes = Math.floor(durationInSeconds / 60);
          const durationSeconds = durationInSeconds % 60;
      
          // Format duration as HH:MM:SS
          const formattedDuration = `${durationHours.toString().padStart(2, "0")}:${durationMinutes.toString().padStart(2, "0")}:${Math.round(durationSeconds.toString().padStart(2, "0"))}`;
      
          return formattedDuration;
        } else {
          return "-------";
        }
      };
  return {calculateDuration}
}

export default CountHours;

