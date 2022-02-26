# What is this?
This is my Discord bot, it does stuff
# How does it work?
It works by using discord.js and MongoDB Atlas
# User commands
Command | Description
------------ | -------------
! | User command prefix
help | Lists commands and their descriptions
owl | Sends an owl photo
rr | Allows to play Russian roulette
prb *something*| Tells a randomly generated probability of *something*
egg *someone*| Throws an egg at *someone* and tells amount of eggs thrown at that person
money | Tells the amount of money the user has
daily | Pays the daily reward (100 hryvnias) to the user
shop | Lists the roles for sale (should be configured by the admin)
buy_role *role* | Allows to buy the *role*
buy_lottery | Allows to buy a lottery ticket
pay *someone* | Allows you to pay *someone*
top| Shows the richest people on the server
# Admin commands
Command | Description
------------ | -------------
*| Admin command prefix
lang en/ru | Allows to set the bot language in a particular text channel
setPaidRole *role_id* *price*| Allows to add a role to the shop, the role is automatically removed from the shop after its deletion
getBotServerDate | Returns the date of the bot's server
createLottery *channel_id* *time*| Creates a daily lottery which results are announced in the specified channel at the specified time (should be an integer from 0 to 23)
removeLottery | Removes the lottery from the server