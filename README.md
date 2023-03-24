# DrMouse Next

Run dev with `npm run dev`

Watch for CSS changes `npm run sass-watch`

Build with `npm run build`

# Run on server using pm2

Install service `pm2 start npm --name "drmouse-next" -- start --watch`

Stop service `pm2 stop drmouse-next`

Remove service `pm2 delete drmouse-next`

Save current process list `pm2 save`

Monitor `pm2 monit`

List of services `pm2 list`

# Watch
Generate ecosystem config `pm2 ecosystem`


# Protected Routes
`components\hoc\withUserRoute.js` - protected route for normal user (Moje zver)
`components\hoc\withVetRoute.js` - protected route for doctor (Vet profile)
`components\hoc\withProfileRedirect.js` - redirect user to it's profile depending on user's role (on Login page)

