<template>
  <ChapterLayout id="epilogue" label="Epilogue" title="Epilogue and Apologue">
    <template #prose>
      <div class="prose-block">
        <p>
          It may be confidently assumed that when this tractate “Calculus made Easy” falls into the hands of the professional mathematicians, they will (if not too lazy) rise up as one man, and damn it as being a thoroughly bad book. Of that there can be, from their point of view, no possible manner of doubt whatever. It commits several most grievous and deplorable errors.
        </p>
        <p>
          First, it shows how ridiculously easy most of the operations of the calculus really are.
        </p>
        <p>
          Secondly, it gives away so many trade secrets. By showing you that <em>what one fool can do, other fools can do also</em>, it lets you see that these mathematical swells, who pride themselves on having mastered such an awfully difficult subject as the calculus, have no such great reason to be puffed up. They like you to think how terribly difficult it is, and don't want that superstition to be rudely dissipated.
        </p>
        <p>
          Thirdly, among the dreadful things they will say about “So Easy” is this: that there is an utter failure on the part of the author to demonstrate with rigid and satisfactory completeness the validity of sundry methods which he has presented in simple fashion, and has even <em>dared to use</em> in solving problems! But why should he not? You don't forbid the use of a watch to every person who does not know how to make one? You don't object to the musician playing on a violin that he has not himself constructed. You don't teach the rules of syntax to children until they have already become fluent in the <em>use</em> of speech. It would be equally absurd to require general rigid demonstrations to be expounded to beginners in the calculus.
        </p>
        <p>
          One other thing will the professed mathematicians say about this thoroughly bad and vicious book: that the reason why it is <em>so easy</em> is because the author has left out all the things that are really difficult. And the ghastly fact about this accusation is that–<em>it is true!</em> That is, indeed, why the book has been written–written for the legion of innocents who have hitherto been deterred from acquiring the elements of the calculus by the stupid way in which its teaching is almost always presented. Any subject can be made repulsive by presenting it bristling with difficulties. The aim of this book is to enable beginners to learn its language, to acquire familiarity with its endearing simplicities, and to grasp its powerful methods of solving problems, without being compelled to toil through the intricate out-of-the-way (and mostly irrelevant) mathematical gymnastics so dear to the unpractical mathematician.
        </p>
        <blockquote>
          There are amongst young engineers a number on whose ears the adage that <em>what one fool can do, another can</em>, may fall with a familiar sound. They are earnestly requested not to give the author away, nor to tell the mathematicians what a fool he really is.
        </blockquote>
      </div>
    </template>
    <template #lab>
      <!-- We use the lab panel here just to hold a nice piece of closing typography or art -->
      <div class="epilogue-art">
        <div class="fool-quote">
          What one fool can do, another can.
        </div>
        <div class="author-sign">
          — Silvanus P. Thompson (1910)
        </div>
      </div>
    </template>
  </ChapterLayout>
</template>

<script setup lang="ts">
import ChapterLayout from '@/components/ChapterLayout.vue'
</script>

<style lang="scss" scoped>
.epilogue-art {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400px;
  padding: 2rem;
  background: var(--surface-hi);
  border-radius: 6px;
  text-align: center;
}

.fool-quote {
  font-family: var(--ff-prose);
  font-size: 2.5rem;
  font-style: italic;
  color: var(--accent);
  line-height: 1.3;
  margin-bottom: 2rem;
  max-width: 15ch;
}

.author-sign {
  font-family: var(--ff-ui);
  font-size: 1rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
</style>
