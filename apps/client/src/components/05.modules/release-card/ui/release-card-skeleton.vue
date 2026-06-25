<script setup lang="ts"></script>

<template>
  <article class="release-card skeleton-card">
    <header class="card-header">
      <div class="s-block s-project" />
      <div class="s-block s-badge" />
    </header>

    <div class="card-body">
      <div class="s-block s-version" />

      <div class="meta-info">
        <div class="s-block s-meta" />
        <div class="s-block s-meta" />
      </div>
    </div>

    <footer class="tickets-section">
      <div class="ticket-list">
        <div class="s-block s-ticket" />
        <div class="s-block s-ticket" style="width: 70px;" />
      </div>
    </footer>
  </article>
</template>

<style scoped lang="scss">
@keyframes skeleton-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 1;
  }
}

.release-card {
  background-color: var(--bg-secondary-color);
  border: 1px solid var(--border-primary-color);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.s-block {
  background-color: var(--bg-tertiary-color);
  border-radius: 6px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .s-project {
    width: 100px;
    height: 18px;
  }
  .s-badge {
    width: 48px;
    height: 24px;
    border-radius: 20px;
  }
}

.card-body {
  margin-bottom: 24px;
  flex-grow: 1;

  .s-version {
    width: 160px;
    height: 28px;
    margin-bottom: 20px;
  }
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .s-meta {
    width: 140px;
    height: 16px;
  }
}

.tickets-section {
  padding-top: 16px;
  border-top: 1px solid var(--border-primary-color);

  .ticket-list {
    display: flex;
    gap: 8px;

    .s-ticket {
      width: 90px;
      height: 24px;
    }
  }
}
</style>
