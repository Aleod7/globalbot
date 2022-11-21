const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken('MTA0MTk0NjYyMDAwNDEzOTA1OA.Gny2aU.WRADAvYreYR_KU_mKkA7fPbyym9nrbk11VSjx4');

// for global commands
rest.delete(Routes.applicationCommand(1041946620004139058n, '1043045835497275432'))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error);