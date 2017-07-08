---
layout: post
title: Open-Sourcing breast_segment
date: 2017-01-03 12:00:00
disqus: y
---

## Fully automated Breast Segmentation on Mammographies

After having tried (and failed) to train a Convolutional Neural Network (CNN) to
identify Mammographies with malignant signs, I decided to open-source
most of the pre-processing tools I had developed in the process.

breast_segment is one of those. I was using Mammographies from the
[Digital Database for Screening Mammography]
which were taken by using traditional X-Ray film and later digitalized (ugh!),
there was lots of noise (dust, text) which had to be removed prior to training
any sort of machine learning model on it. The seemingly obvious way was to
develop some sort of automatic segmentation of the breast area.

In medicine and especially medical research, sharing your data or even source code
is, well, not only uncommon but often actively discouraged.
It didn't come as a surprise that, of the published breast segmentation
algorithms, no implementation can be found.

<img src="https://github.com/olieidel/breast_segment/raw/master/images/jpeg/original.jpg" width="48%" alt="Original Image" />
<img src="https://github.com/olieidel/breast_segment/raw/master/images/jpeg/mask.jpg" width="48%" alt="Computed Segmentation Mask" />
<img src="https://github.com/olieidel/breast_segment/raw/master/images/jpeg/bbox.jpg" width="48%" alt="Computed Bounding Box" />
<img src="https://github.com/olieidel/breast_segment/raw/master/images/jpeg/overlay.jpg" width="48%" alt="Overlay Visualization" />

So I developed my own, based on [Felzenzwalb's Algorithm]. It works by basically
just looking for the largest connected region - hardly specific to Mammographies -
and creating a boolean segmentation mask. In around eight out of ten images,
it works (good luck segmenting the remaining two).

Have a look at the [Repo on GitHub]! I also provided an IPython Notebook
[walk-through example].

Good luck in your research and feel free to contact me if you have any questions.

<!-- Links -->
[Digital Database for Screening Mammography]: http://marathon.csee.usf.edu/Mammography/Database.html
[DDSM]: http://marathon.csee.usf.edu/Mammography/Database.html
[Felzenzwalb's Algorithm]: http://scikit-image.org/docs/dev/api/skimage.segmentation.html#skimage.segmentation.felzenszwalb
[Repo on GitHub]: https://github.com/olieidel/breast_segment
[walk-through example]: https://github.com/olieidel/breast_segment/blob/master/examples/ddsm_examples.ipynb
