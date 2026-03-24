import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const mapping: Record<string, string> = {
  'my-side-of-the-mountain': 'https://www.amazon.com/dp/0140348107',
  'anathem': 'https://www.amazon.com/dp/006147410X',
  'art-physics-parallel-visions-in-space-time-light': 'https://www.amazon.com/dp/0688123058',
  'the-hitchhikers-guide-to-the-galaxy': 'https://www.amazon.com/dp/0345391802',
  'infinite-jest': 'https://www.amazon.com/dp/0316920045',
  'one-hundred-years-of-solitude': 'https://www.amazon.com/dp/0060883286',
  'conquerors': 'https://www.amazon.com/dp/0812994000',
  'kafka-on-the-shore': 'https://www.amazon.com/dp/1400079276',
  'living-to-tell-the-tale': 'https://www.amazon.com/dp/1400041341',
  'neuromancer': 'https://www.amazon.com/dp/0441569595',
  'the-ground-beneath-her-feet': 'https://www.amazon.com/dp/0312254997',
  'the-wind-up-bird-chronicle': 'https://www.amazon.com/dp/0679775439',
  'zen-and-the-art-of-motorcycle-maintenance': 'https://www.amazon.com/dp/0060839872',
  'nineteen-eighty-four': 'https://www.amazon.com/dp/0451524934',
  'a-farewell-to-arms': 'https://www.amazon.com/dp/0684801469',
  'a-thousand-splendid-suns': 'https://www.amazon.com/dp/159448385X',
  'animal-farm': 'https://www.amazon.com/dp/0451526341',
  'bagombo-snuff-box': 'https://www.amazon.com/dp/0425174468',
  'being-and-nothingness': 'https://www.amazon.com/dp/0671867806',
  'blue-ocean-strategy': 'https://www.amazon.com/dp/1591396190',
  'brief-interviews-with-hideous-men': 'https://www.amazon.com/dp/0316925411',
  'chaos-and-cyber-culture': 'https://www.amazon.com/dp/0914171771',
  'consider-the-lobster': 'https://www.amazon.com/dp/0316156116',
  'disgrace': 'https://www.amazon.com/dp/0140296409',
  'do-androids-dream-of-electric-sheep': 'https://www.amazon.com/dp/0345404475',
  'dune': 'https://www.amazon.com/dp/0441013597',
  'genghis-khan-and-the-making-of-the-modern-world': 'https://www.amazon.com/dp/0609809644',
  'g-del-escher-bach-an-eternal-golden-braid': 'https://www.amazon.com/dp/0465026567',
  'hegemony-or-survival': 'https://www.amazon.com/dp/0805076883',
  'hocus-pocus': 'https://www.amazon.com/dp/0425161293',
  'home-town': 'https://www.amazon.com/dp/0671785214',
  'hunter': 'https://www.amazon.com/dp/0525935681',
  'imperial-twilight': 'https://www.amazon.com/dp/B07C3CPG3V',
  'inherent-vice': 'https://www.amazon.com/dp/0143117564',
  'jailbird': 'https://www.amazon.com/dp/0385333900',
  'lila-an-inquiry-into-morals': 'https://www.amazon.com/dp/0553299611',
  'nobody-here-gets-out-alive': 'https://www.amazon.com/dp/0446697338',
  'on-the-road': 'https://www.amazon.com/dp/1644282925',
  'philip-and-alexander-kings-and-conquerors': 'https://www.amazon.com/dp/154164669X',
  'sapiens-a-brief-history-of-humankind': 'https://www.amazon.com/dp/0063422018',
  'schr-dinger-s-cat-trilogy': 'https://www.amazon.com/dp/0440500702',
  'the-48-laws-of-power': 'https://www.amazon.com/dp/0140280197',
  'the-changing-world-order': 'https://www.amazon.com/dp/1982160276',
  'the-colours-of-infinity': 'https://www.amazon.com/dp/1904555055',
  'the-complete-short-stories-of-ernest-hemingway': 'https://www.amazon.com/dp/0684843323',
  'the-dharma-bums': 'https://www.amazon.com/dp/0140042520',
  'the-fillmore-east': 'https://www.amazon.com/dp/0762788658',
  'the-great-brain': 'https://www.amazon.com/dp/B0000U7N28',
  'the-hardy-boys': 'https://www.amazon.com/dp/0593089804',
  'the-jungle': 'https://www.amazon.com/dp/0486419231',
  'the-lessons-of-history': 'https://www.amazon.com/dp/143914995X',
  'the-silk-roads-a-new-history-of-the-world': 'https://www.amazon.com/dp/1101912375',
  'the-stranger': 'https://www.amazon.com/dp/0679720200',
  'the-sun-also-rises': 'https://www.amazon.com/dp/0743297334',
  'the-swerve-how-the-world-became-modern': 'https://www.amazon.com/dp/0393343405',
  'the-verge-reformation-renaissance-and-forty-years-that-shook-the-world': 'https://www.amazon.com/dp/1538701189',
  'the-wilco-book': 'https://www.amazon.com/dp/0971367035',
  'thought-contagion': 'https://www.amazon.com/dp/0465084664',
  'timequake': 'https://www.amazon.com/dp/0425164349',
  'true-hallucinations': 'https://www.amazon.com/dp/0062505459',
  'weaveworld': 'https://www.amazon.com/dp/1982158093',
  'steve-jobs': 'https://www.amazon.com/dp/1451648545',
  'stealing-fire': 'https://www.amazon.com/dp/0062429663',
  'strange-pilgrims': 'https://www.amazon.com/dp/1400034698',
  'the-shining': 'https://www.amazon.com/dp/0307743659',
  'digital-minimalism': 'https://www.amazon.com/dp/0525542876',
};

async function main() {
  console.log(`Updating amazon_url for ${Object.keys(mapping).length} books...`);
  let ok = 0;
  let miss = 0;

  for (const [slug, url] of Object.entries(mapping)) {
    const { error, data } = await supabaseAdmin
      .from('books')
      .update({ amazon_url: url })
      .eq('slug', slug)
      .select('id');

    if (error) {
      console.error(`  ✗ ${slug}: ${error.message}`);
    } else if (!data || data.length === 0) {
      console.log(`  — ${slug}: not found in DB (skipped)`);
      miss++;
    } else {
      console.log(`  ✓ ${slug}`);
      ok++;
    }
  }

  console.log(`\nDone: ${ok} updated, ${miss} not found`);
}

main();
