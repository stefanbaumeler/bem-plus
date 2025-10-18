import { defineConfig } from 'eslint/config'

import { config as sbBaseConfig } from '@sb-lint/eslint-config-base'
import { config as sbTsConfig } from '@sb-lint/eslint-config-ts'

export default defineConfig([
    ...sbBaseConfig,
    ...sbTsConfig
])
