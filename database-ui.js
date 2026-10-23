// Database controls are kept separate from the tournament session logic.
$('#addPlayer').onclick=async()=>{let input=$('#nameInput'),name=input.value.trim();if(!name)return;if(state.rounds.length){showToast('Roster is locked once round one begins');return}try{let savedName=await savePlayer(name);addRosterPlayer(savedName);input.value=''}catch(error){showToast(error.message)}};
loadSavedPlayers();
