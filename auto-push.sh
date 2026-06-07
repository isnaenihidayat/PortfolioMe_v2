#!/usr/bin/env bash
# =============================================================================
# auto-push.sh — Auto Commit & Push ke GitHub (isnaenihidayat/PortfolioMe_v2)
# =============================================================================
# Penggunaan:
#   bash auto-push.sh                    → commit semua perubahan, pesan otomatis
#   bash auto-push.sh "pesan commit"     → commit dengan pesan custom
#   bash auto-push.sh -b feat/nama-fitur → buat & push branch baru
#   bash auto-push.sh --build            → build dulu sebelum push
# =============================================================================

set -e  # Berhenti jika ada error

# ── Konfigurasi ──────────────────────────────────────────────────────────────
REMOTE="origin"
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")
REPO_URL="https://github.com/isnaenihidayat/PortfolioMe_v2"

# ── Warna terminal ────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# ── Helper functions ──────────────────────────────────────────────────────────
info()    { echo -e "${CYAN}ℹ${RESET}  $1"; }
success() { echo -e "${GREEN}✓${RESET}  $1"; }
warn()    { echo -e "${YELLOW}⚠${RESET}  $1"; }
error()   { echo -e "${RED}✗${RESET}  $1"; exit 1; }
header()  { echo -e "\n${BOLD}${CYAN}$1${RESET}"; echo "─────────────────────────────────────"; }

# ── Banner ────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}  🚀 PortfolioMe v2 — Auto Push${RESET}"
echo -e "  ${YELLOW}→${RESET} ${REPO_URL}"
echo ""

# ── Parse argumen ─────────────────────────────────────────────────────────────
CUSTOM_MSG=""
NEW_BRANCH=""
DO_BUILD=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -b|--branch)
      NEW_BRANCH="$2"; shift 2 ;;
    --build)
      DO_BUILD=true; shift ;;
    -h|--help)
      echo "Penggunaan:"
      echo "  bash auto-push.sh                    → auto commit + push"
      echo "  bash auto-push.sh \"pesan\"             → pesan commit custom"
      echo "  bash auto-push.sh -b nama-branch      → push ke branch baru"
      echo "  bash auto-push.sh --build             → build sebelum push"
      echo "  bash auto-push.sh --build \"pesan\"      → build + pesan custom"
      exit 0 ;;
    *)
      CUSTOM_MSG="$1"; shift ;;
  esac
done

# ── 0. Pastikan di direktori yang benar ───────────────────────────────────────
if [ ! -f "package.json" ] || ! grep -q "portfoliome" package.json 2>/dev/null; then
  error "Jalankan script ini dari root folder PortfolioMe_v2!"
fi

# ── 1. Optional: build sebelum push ──────────────────────────────────────────
if [ "$DO_BUILD" = true ]; then
  header "1/4  Build"
  info "Menjalankan npm run build..."
  if npm run build --silent; then
    success "Build berhasil!"
  else
    error "Build gagal — push dibatalkan. Periksa error di atas."
  fi
fi

# ── 2. Cek apakah ada perubahan ───────────────────────────────────────────────
header "$([ "$DO_BUILD" = true ] && echo '2/4' || echo '1/3')  Git Status"

if git diff --quiet && git diff --staged --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
  warn "Tidak ada perubahan untuk di-commit."
  info "Working tree bersih. Tidak ada yang perlu di-push."
  echo ""
  exit 0
fi

# Tampilkan file yang berubah
CHANGED=$(git status --short)
echo -e "${YELLOW}File yang berubah:${RESET}"
echo "$CHANGED" | sed 's/^/  /'
echo ""

# ── 3. Buat pesan commit ──────────────────────────────────────────────────────
if [ -z "$CUSTOM_MSG" ]; then
  # Pesan otomatis berdasarkan file yang berubah
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M')
  CHANGED_FILES=$(git status --short | awk '{print $2}' | head -5 | tr '\n' ', ' | sed 's/,$//')
  FILE_COUNT=$(git status --short | wc -l | tr -d ' ')

  if [ "$FILE_COUNT" -eq 1 ]; then
    COMMIT_MSG="update: $CHANGED_FILES · $TIMESTAMP"
  else
    COMMIT_MSG="update: $FILE_COUNT files changed ($CHANGED_FILES...) · $TIMESTAMP"
  fi
else
  COMMIT_MSG="$CUSTOM_MSG"
fi

# ── 4. Stage semua perubahan ──────────────────────────────────────────────────
header "$([ "$DO_BUILD" = true ] && echo '3/4' || echo '2/3')  Commit"
info "Staging semua perubahan..."
git add .

info "Commit: \"${COMMIT_MSG}\""
git commit -m "$COMMIT_MSG"
success "Commit berhasil!"

# ── 5. Push ke remote ─────────────────────────────────────────────────────────
header "$([ "$DO_BUILD" = true ] && echo '4/4' || echo '3/3')  Push"

if [ -n "$NEW_BRANCH" ]; then
  info "Membuat branch baru: ${NEW_BRANCH}"
  git checkout -b "$NEW_BRANCH"
  BRANCH="$NEW_BRANCH"
fi

info "Pushing ke ${REMOTE}/${BRANCH}..."
git push "$REMOTE" "$BRANCH"

# ── Selesai ───────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}  ✅ Berhasil di-push ke GitHub!${RESET}"
echo -e "  ${CYAN}→${RESET} ${REPO_URL}/tree/${BRANCH}"
echo -e "  ${CYAN}→${RESET} Vercel akan auto-deploy dalam ~1-2 menit"
echo -e "  ${CYAN}→${RESET} https://portfoliome-v2.vercel.app"
echo ""
