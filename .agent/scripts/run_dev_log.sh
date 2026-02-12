
#!/bin/bash
lsof -ti :3000 | xargs kill -9 2>/dev/null
npm run dev > .next/dev.log 2>&1 &
echo $! > .next/dev.pid
