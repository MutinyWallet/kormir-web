set dotenv-load := false

dev:
    pnpm run dev

local:
    pnpm install && pnpm link --global "@benthecarman/kormir-wasm"

remote:
    pnpm unlink --filter "@benthecarman/kormir-wasm" && pnpm install

native:
    pnpm install && pnpm build && npx cap sync

test:
    pnpm exec playwright test
    
test-ui:
    pnpm exec playwright test --ui
