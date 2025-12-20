import React from "react";
import Wrapper from "../../components/Wrapper";

const ProjectDetail = () => {
  return (
    <Wrapper>
      <div className="space-y-10 text-neutral-500">
        {/* Project Image */}
        <img
          src="/images/projects/project.jpeg"
          alt="project"
          className="w-full max-w-4xl mx-auto aspect-video object-cover shadow-md"
          width={800}
          height={800}
          priority
        />

        {/* Project Content */}
        <div className="space-y-6">
          <div className="text-center font-bold text-xl sm:text-2xl md:text-3xl leading-snug">
            Budget-Friendly Interior Design Ideas for a Luxe Look
          </div>

          <div className="space-y-4 text-justify leading-relaxed text-gray-700">
            <p>
              When, while the lovely valley teems with vapor around me, and the
              meridian sun strikes the upper surface of the impenetrable foliage
              of my trees, and but a few stray gleams steal into the inner
              sanctuary, I throw myself down among the tall grass by the
              trickling stream; and, as I lie close to the earth, a thousand
              unknown plants are noticed by me: when I hear the buzz of the
              little world among the stalks, and grow familiar with the
              countless indescribable forms of the insects and flies, then I
              feel the presence of the Almighty, who formed us in his own image,
              and the breath of that universal love which bears and sustains us,
              as it floats around us in an eternity of bliss; and then, my
              friend, when darkness overspreads my eyes, and heaven and earth
              seem to dwell in my soul and absorb its power, like the form of a
              beloved mistress, then I often think with longing, Oh, would I
              could describe these conceptions, could impress upon paper all
              that is living so full and warm within me, that it might be the
              mirror of my soul, as my soul is the mirror of the infinite God!
            </p>

            <p>
              O my friend — but it is too much for my strength — I sink under
              the weight of the splendor of these visions! A wonderful serenity
              has taken possession of my entire soul, like these sweet mornings
              of spring which I enjoy with my whole heart. I am alone, and feel
              the charm of existence in this spot, which was created for the
              bliss of souls like mine.
            </p>

            <p>
              I am so happy, my dear friend, so absorbed in the exquisite sense
              of mere tranquil existence, that I neglect my talents. I should be
              incapable of drawing a single stroke at the present moment; and
              yet I feel that I never was a greater artist than now.
            </p>

            <p>
              When, while the lovely valley teems with vapor around me, and the
              meridian sun strikes the upper surface of the impenetrable foliage
              of my trees, and but a few stray gleams steal into the inner
              sanctuary, I throw myself down among the tall grass by the
              trickling stream; and, as I lie close to the earth, a thousand
              unknown plants are noticed by me: when I hear the buzz of the
              little world among the stalks, and grow familiar with the
              countless indescribable forms of the insects and flies, then I
              feel the presence of the Almighty, who formed us in his own image,
              and the breath of that universal love which bears and sustains us,
              as it floats around us in an eternity of bliss; and then, my
              friend, when darkness overspreads my eyes, and heaven and earth
              seem to dwell in my soul and absorb its power, like the form of a
              beloved mistress.
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ProjectDetail;
