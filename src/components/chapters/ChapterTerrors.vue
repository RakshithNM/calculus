<template>
  <ChapterLayout id="terrors" label="Chapter I" title="To Deliver You From The Preliminary Terrors">
    <template #prose>
      <div class="prose-block">
        <p>
          Calculus has a reputation for being terrifying, mostly because mathematicians like to use intimidating symbols to guard their secrets. Thompson's first goal is to deliver you from these "preliminary terrors."
        </p>
        <blockquote>
          "What one fool can do, another can."
        </blockquote>
        <p>
          The entire subject hinges on just two symbols that you need to demystify right now.
        </p>
        <p>
          The first is <span class="hi">d</span>, which merely means <em>"a little bit of."</em> 
          Thus <span class="dx">dx</span> means a little bit of <span class="dx">x</span>; or <span class="dx">du</span> means a little bit of <span class="dx">u</span>. Ordinary mathematicians think it is more polite to say "an element of," just as you would say "an element of regret" instead of "a little bit of regret."
        </p>
        <p>
          The second is <span class="hi">∫</span>, which is merely a long <em>S</em>, and means <em>"the sum of."</em> 
          Thus <span class="dx">∫ dx</span> means the sum of all the little bits of <span class="dx">x</span>.
        </p>
        <p>
          That is all. If you can understand that <span class="hi">d</span> breaks things apart into little bits, and <span class="hi">∫</span> glues them back together, you are ready to learn calculus.
        </p>
      </div>
    </template>
    <template #lab>
      <LabPanel label="The Two Symbols">
        <div class="symbols-display">
          <div class="symbol-card">
            <div class="symbol">d</div>
            <div class="meaning">"A little bit of"</div>
            <div class="example"><span class="dx">dx</span> = a little bit of x</div>
          </div>
          <div class="symbol-card">
            <div class="symbol">∫</div>
            <div class="meaning">"The sum of"</div>
            <div class="example"><span class="dx">∫ dx</span> = the sum of all little bits of x</div>
          </div>
        </div>
      </LabPanel>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
import LabPanel from '@/components/LabPanel.vue'
</script>

<style lang="scss" scoped>
.symbols-display {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem 0;
}

.symbol-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.symbol {
  font-family: var(--ff-prose);
  font-size: 4rem;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 0.5rem;
  font-style: italic;
}

.meaning {
  font-family: var(--ff-ui);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.example {
  font-family: var(--ff-ui);
  font-size: 0.9rem;
  color: var(--text-muted);
}
</style>
