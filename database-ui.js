// Database controls are kept separate from the tournament session logic.
const flyout=$('#playerDatabaseFlyout'),backdrop=$('#playerDatabaseBackdrop');
function setDatabaseOpen(open){flyout.classList.toggle('is-open',open);flyout.setAttribute('aria-hidden',String(!open));backdrop.hidden=!open;document.body.classList.toggle('flyout-open',open);if(open)$('#nameInput').focus()}
$('#openPlayerDatabase').onclick=()=>setDatabaseOpen(true);$('#closePlayerDatabase').onclick=()=>setDatabaseOpen(false);backdrop.onclick=()=>setDatabaseOpen(false);document.addEventListener('keydown',event=>{if(event.key==='Escape'&&flyout.classList.contains('is-open'))setDatabaseOpen(false)});
$('#playerSearch').oninput=event=>{playerSearch=event.target.value;renderSavedPlayers()};
$('#addPlayer').onclick=()=>{};
$('#playerDatabaseForm').onsubmit=async event=>{event.preventDefault();let input=$('#nameInput'),name=input.value.trim();if(!name)return;if(state.rounds.length){showToast('Roster is locked once round one begins');return}try{let savedName=await savePlayer(name);addRosterPlayer(savedName);input.value='';$('#playerSearch').value=''}catch(error){showToast(error.message)}};
loadSavedPlayers();
