### Commands to run server

`npm run dev` to run the backend

### network config commands

1. `nmcli radio wifi on ` <br>
2. `nmcli device wifi hotspot ifname wlp4s0 ssid meddevice password 12345678` <br>
3. `sudo systemctl restart NetworkManager` <br>
4. `cd /etc/NetworkManager/system-connections` and edit `Hotspot.nmconnection`