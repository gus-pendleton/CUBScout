var documenterSearchIndex = {"docs":
[{"location":"","page":"Home","title":"Home","text":"CurrentModule = CUBScout","category":"page"},{"location":"#CUBScout","page":"Home","title":"CUBScout","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Documentation for CUBScout.","category":"page"},{"location":"","page":"Home","title":"Home","text":"","category":"page"},{"location":"","page":"Home","title":"Home","text":"Modules = [CUBScout]","category":"page"},{"location":"#CUBScout.example_data_path","page":"Home","title":"CUBScout.example_data_path","text":"example_data_path\n\nThe path to an example dataset, stored as an artifact within the package. This is an .fna file containing coding sequences from Bacillus subtilis subsp. subtilis str. 168, NCBI Accession # NC_000964.3.\n\n\n\n\n\n","category":"constant"},{"location":"#CUBScout.codon_dict","page":"Home","title":"CUBScout.codon_dict","text":"codon_dict\n\nThe codon_dict type defines how codons are translated, and is essential for calculating codon usage bias as it identifies stop codons and each amino acid's degeneracy. A default codon dictionary is provided (default_codon_dict), or a user can make their own using the make_codon_dict function.\n\nFields\n\ncodons: the 64 codons, in alphabetical order\nAA: corresponding amino acid for each codon (64 entries long)\nAA_nostops: same as AA, but with stop codons removed\nuniqueAA: unique amino acid names including stop codons. Under a standard translation table, this is 21 amino acids long\nuniqueAA: same as uniqueAA, but with stop codons removed\nuniqueI: a vector of the same length as uniqueAA, containing vectors of the indices of each codon for that amino acid. For instance, the first entry corresponds to Lysine, and contains the vector [1, 3], corresponding to the positions of codons AAA and AAG in the codons field\nuniqueI_nostops: same as uniqueI, but with stop codons removed\ndeg: a vector of the same length as uniqueAA, containing the degeneracy for each amino acid.\ndeg_nostops: same as deg, but with stop codons removed\nstop_mask: a Boolean vector of length 64 which is false for stop codons. This is used to remove stop codons when calculating codon usage bias.\n\nNotes\n\nGenerally, CUBScout users shouldn't need to interact with the codon_dict type, as the standard genetic code is applied by default. Details for constructing a custom codon_dict are documented under the make_codon_dict function.\n\n\n\n\n\n","category":"type"},{"location":"#CUBScout.b","page":"Home","title":"CUBScout.b","text":"b(filepath::String, dict::codon_dict = default_codon_dict; ref_seqs = (), rm_start = false, rm_stop = false, threshold = 80, dataframe = false)\n\nCalculate B from Karlin and Mrazek, 1996. \n\nArguments\n\n-filepath: path to fasta file of coding sequences (e.g. .fasta, .fna, .fa). There are no quality checks, so it's assumed that each entry is assumed to be an individual coding sequence, in the correct frame, without 5' or 3' untranslated regions. -dict: codon dictionary of type codondict. The standard genetic code is loaded by default, but if necessary you can create your own codon dictionary using `makecodondict-refseqs: by default, codon usage bias for each gene is calculated using the whole genome (\"self\") as a reference subset. If you would like to specify your own subsets to calculate against, such as ribosomal genes, ref_seqs takes a named tuple in the form(\"subsetname\" = Bool[],) where Bool is the same length as the number of sequences in your fasta file, and contains true for sequences you want as your reference subset and false for those you don't. You can use `findseqs()to generate this vector. You can provide multiple reference subsets as separate entries in the named tuple, andCUBScoutwill return the calculated measure using each subset. -rmstart: whether to ignore the first codon of each sequence. Many organisms use alternative start codons such as TTG and CTG, which in other locations would generally code for leucine. There are a few approaches to deal with this. By default,CUBScoutkeeps each start codon and assigns it as though it were any other codon. Of course, this would slightly change leucine's contribution to codon usage bias. If you setrmstarttotrue, the first codon of every sequence is simply discarded. This will also affect the gene's length, which means it could be removed if it falls under the threshold. Other CUB packages (such as R's coRdon, alt.init = TRUE), assign all TTG and CTG codons to methionine, regardless of their location. I disagree with this approach from a biological perspective; those codons still code for leucine most of the time they are used. However, if you want matching output as you would get from coRdon, you can supplyaltstartcodondictto thedictargument, and keeprmstartandfalse. -rmstop: whether to remove stop codons from calculations of codon usage bias. -threshold: minimum length of a gene (in codons) to be used in codon usage bias calculations. By default this is set to 80 codons; any genes less than or equal to that length are discarded. If you want no genes discarded, setthreshold`to 0. -dataframe: whether to format output as a dataframe. By default results are returned as vectors or named tuples (if the measure uses reference subsets). Settingdataframe = true` will instead output a dataframe, though at a slight performance cost.\n\nExamples\n\njulia> result = b(exampledatapath) # Run B on example dataset (self = [0.20912699220973896, 0.3289759448740455, 0.22365336363593893, 0.5391135258658497, 0.24919594143501034, 0.2880358413249049, 0.31200964304415874, 0.34858035204347476, 0.2455189361074733, 0.4690734561271221  …  0.3629137353834403, 0.3621330537227321, 0.4535285720373026, 0.3357858047622507, 0.28183191395624935, 0.2668809561422238, 0.22381338105820905, 0.4034837015709619, 0.3594626865160133, 0.3724863965444541],)\n\njulia> result300 = b(exampledata_path, threshold = 300); # Increase threshold length\n\njulia> length(result.self) 3801\n\njulia> length(result_300.self) 1650\n\njulia> b(exampledatapath, altstartcodondict) # Use alternative start codons (self = [0.20897234061622738, 0.33515000264964157, 0.23659038285006437, 0.5444798345895256, 0.2510726777670733, 0.2931440715811394, 0.32097661134289895, 0.35705614480228676, 0.25452296343822073, 0.513313870450466  …  0.34414371567411556, 0.38229515825882665, 0.4592524704597901, 0.3399477982926337, 0.29297757306048133, 0.2680028918895221, 0.2168486105068708, 0.414543030746344, 0.3829702745346273, 0.39870546723886807],)\n\njulia> b(exampledatapath, dataframe = true) # Get output in dataframe format 3801×3 DataFrame   Row │ self      Identifier                         File                                     │ Float64   String                             String                             ──────┼────────────────────────────────────────────────────────────────────────────────     1 │ 0.209127  lcl|NC000964.3cdsNP387882.11  /Users/augustuspendleton/.julia/…     2 │ 0.328976  lcl|NC000964.3cdsNP387883.12  /Users/augustuspendleton/.julia/…     3 │ 0.223653  lcl|NC000964.3cdsNP387885.14  /Users/augustuspendleton/.julia/…     4 │ 0.539114  lcl|NC000964.3cdsNP387886.25  /Users/augustuspendleton/.julia/…   ⋮   │    ⋮                      ⋮                                  ⋮  3799 │ 0.403484  lcl|NC000964.3cdsNP391983.1…  /Users/augustuspendleton/.julia/…  3800 │ 0.359463  lcl|NC000964.3cdsNP391984.1…  /Users/augustuspendleton/.julia/…  3801 │ 0.372486  lcl|NC000964.3cdsNP391985.1_…  /Users/augustuspendleton/.julia/…                                                                       3794 rows omitted\n\njulia> allgenes = findseqs(exampledatapath, r\"\"); # Get a vector which is true for all genes\n\njulia> ribosomalgenes = findseqs(exampledatapath, r\"ribosomal\"); # Get a vector which is true for ribosomal genes\n\njulia> b(exampledatapath, refseqs = (ribosomal = ribosomalgenes,), dataframe = true) # Calculate B using ribosomal genes as a reference subset 3801×3 DataFrame   Row │ ribosomal  Identifier                         File                                     │ Float64    String                             String                             ──────┼─────────────────────────────────────────────────────────────────────────────────     1 │  0.274331  lcl|NC000964.3cdsNP387882.11  /Users/augustuspendleton/.julia/…     2 │  0.32069   lcl|NC000964.3cdsNP387883.12  /Users/augustuspendleton/.julia/…     3 │  0.255325  lcl|NC000964.3cdsNP387885.14  /Users/augustuspendleton/.julia/…     4 │  0.546493  lcl|NC000964.3cdsNP387886.25  /Users/augustuspendleton/.julia/…   ⋮   │     ⋮                      ⋮                                  ⋮  3799 │  0.406673  lcl|NC000964.3cdsNP391983.1…  /Users/augustuspendleton/.julia/…  3800 │  0.375857  lcl|NC000964.3cdsNP391984.1…  /Users/augustuspendleton/.julia/…  3801 │  0.437981  lcl|NC000964.3cdsNP391985.1_…  /Users/augustuspendleton/.julia/…                                                                        3794 rows omitted\n\njulia> b(exampledatapath, refseqs = (self = allgenes, ribosomal = ribosomalgenes,), dataframe = true) # Calculate B using all genes and ribosomal genes as a reference subset 3801×4 DataFrame   Row │ self      ribosomal  Identifier                         File                                     │ Float64   Float64    String                             String                             ──────┼───────────────────────────────────────────────────────────────────────────────────────────     1 │ 0.209127   0.274331  lcl|NC000964.3cdsNP387882.11  /Users/augustuspendleton/.julia/…     2 │ 0.328976   0.32069   lcl|NC000964.3cdsNP387883.12  /Users/augustuspendleton/.julia/…     3 │ 0.223653   0.255325  lcl|NC000964.3cdsNP387885.14  /Users/augustuspendleton/.julia/…     4 │ 0.539114   0.546493  lcl|NC000964.3cdsNP387886.25  /Users/augustuspendleton/.julia/…   ⋮   │    ⋮          ⋮                      ⋮                                  ⋮  3799 │ 0.403484   0.406673  lcl|NC000964.3cdsNP391983.1…  /Users/augustuspendleton/.julia/…  3800 │ 0.359463   0.375857  lcl|NC000964.3cdsNP391984.1…  /Users/augustuspendleton/.julia/…  3801 │ 0.372486   0.437981  lcl|NC000964.3cdsNP391985.1…  /Users/augustuspendleton/.julia/…                                                                                  3794 rows omitted\n\n\n\n\n\n","category":"function"},{"location":"#CUBScout.find_seqs-Tuple{AbstractString, Regex}","page":"Home","title":"CUBScout.find_seqs","text":"find_seqs(path::AbstractString, match_pattern::Regex)\n\nRead a fasta file at path and query the description field for a given Regex match_pattern. These results can be supplied in either the reference tuples (for codon usage bias functions) or reference vectors (for expressivity measures).\n\nExamples\n\njldoctest julia> find_seqs(example_data_path, r\"ribosomal\") 4237-element Vector{Bool}:  0  0  0  0  0  0  ⋮  0  0  0  0  1\n\n\n\n\n\n","category":"method"},{"location":"#CUBScout.make_codon_dict","page":"Home","title":"CUBScout.make_codon_dict","text":"make_codon_dict(filepath::AbstractString, delimiter::AbstractChar = '\t')\n\nMake a custom codon dictionary for organisms with non-standard genetic code. filepath points to a delimited file with two columns and no header. the first column should be codons, and the second column their corresponding amino acid. Avoid spaces and special characters (e.g., write GlutamicAcid instead of Glutamic Acid). Stop codons can be coded as Stop, stop, STOP, or *. If delimited using any character outside of tab, supply the delimiter as the second argument as Char, not a string (e.g. ',' not \",\"). make_codon_dict uses readdlm from DelimitedFiles; it's a good idea to check whether readdlm parses your file correctly before passing to make_codon_dict\n\nExamples\n\njulia> my_codon_dict = make_codon_dict(CUBScout.codon_dict_path)\ncodon_dict(BioSequences.LongSequence{BioSequences.DNAAlphabet{2}}[AAA, AAC, AAG, AAT, ACA, ACC, ACG, ACT, AGA, AGC  …  TCG, TCT, TGA, TGC, TGG, TGT, TTA, TTC, TTG, TTT], [\"Lysine\", \"Asparagine\", \"Lysine\", \"Asparagine\", \"Threonine\", \"Threonine\", \"Threonine\", \"Threonine\", \"Arginine\", \"Serine\"  …  \"Serine\", \"Serine\", \"Stop\", \"Cysteine\", \"Tryptophan\", \"Cysteine\", \"Leucine\", \"Phenylalanine\", \"Leucine\", \"Phenylalanine\"], [\"Lysine\", \"Asparagine\", \"Lysine\", \"Asparagine\", \"Threonine\", \"Threonine\", \"Threonine\", \"Threonine\", \"Arginine\", \"Serine\"  …  \"Serine\", \"Serine\", \"Serine\", \"Cysteine\", \"Tryptophan\", \"Cysteine\", \"Leucine\", \"Phenylalanine\", \"Leucine\", \"Phenylalanine\"], [\"Lysine\", \"Asparagine\", \"Threonine\", \"Arginine\", \"Serine\", \"Isoleucine\", \"Methionine\", \"Glutamine\", \"Histidine\", \"Proline\"  …  \"Glutamicacid\", \"Asparticacid\", \"Alanine\", \"Glycine\", \"Valine\", \"Stop\", \"Tyrosine\", \"Cysteine\", \"Tryptophan\", \"Phenylalanine\"], [\"Lysine\", \"Asparagine\", \"Threonine\", \"Arginine\", \"Serine\", \"Isoleucine\", \"Methionine\", \"Glutamine\", \"Histidine\", \"Proline\", \"Leucine\", \"Glutamicacid\", \"Asparticacid\", \"Alanine\", \"Glycine\", \"Valine\", \"Tyrosine\", \"Cysteine\", \"Tryptophan\", \"Phenylalanine\"], Vector{Int32}[[1, 3], [2, 4], [5, 6, 7, 8], [9, 11, 25, 26, 27, 28], [10, 12, 53, 54, 55, 56], [13, 14, 16], [15], [17, 19], [18, 20], [21, 22, 23, 24]  …  [33, 35], [34, 36], [37, 38, 39, 40], [41, 42, 43, 44], [45, 46, 47, 48], [49, 51, 57], [50, 52], [58, 60], [59], [62, 64]], Vector{Int32}[[1, 3], [2, 4], [5, 6, 7, 8], [9, 11, 25, 26, 27, 28], [10, 12, 51, 52, 53, 54], [13, 14, 16], [15], [17, 19], [18, 20], [21, 22, 23, 24], [29, 30, 31, 32, 58, 60], [33, 35], [34, 36], [37, 38, 39, 40], [41, 42, 43, 44], [45, 46, 47, 48], [49, 50], [55, 57], [56], [59, 61]], Int32[2, 2, 4, 6, 6, 3, 1, 2, 2, 4  …  2, 2, 4, 4, 4, 3, 2, 2, 1, 2], Int32[2, 2, 4, 6, 6, 3, 1, 2, 2, 4, 6, 2, 2, 4, 4, 4, 2, 2, 1, 2], Bool[1, 1, 1, 1, 1, 1, 1, 1, 1, 1  …  1, 1, 0, 1, 1, 1, 1, 1, 1, 1])\n\njulia> typeof(my_codon_dict)\ncodon_dict\n\njulia> fieldnames(codon_dict)\n(:codons, :AA, :AA_nostops, :uniqueAA, :uniqueAA_nostops, :uniqueI, :uniqueI_nostops, :deg, :deg_nostops, :stop_mask)\n\n\n\n\n\n","category":"function"},{"location":"#CUBScout.seq_descriptions-Tuple{AbstractString}","page":"Home","title":"CUBScout.seq_descriptions","text":"seq_descriptions(path::AbstractString)\n\nRead a fasta file at path and return the description fields. Just adds convenience on top of FASTX functions.\n\nExamples\n\njulia> seq_descr = seq_descriptions(example_data_path)\n4237-element Vector{String}:\n \"lcl|NC_000964.3_cds_NP_387882.1\" ⋯ 430 bytes ⋯ \"ocation=410..1750] [gbkey=CDS]\"\n \"lcl|NC_000964.3_cds_NP_387883.1\" ⋯ 315 bytes ⋯ \"cation=1939..3075] [gbkey=CDS]\"\n \"lcl|NC_000964.3_cds_NP_387884.1\" ⋯ 305 bytes ⋯ \"cation=3206..3421] [gbkey=CDS]\"\n \"lcl|NC_000964.3_cds_NP_387885.1\" ⋯ 350 bytes ⋯ \"cation=3437..4549] [gbkey=CDS]\"\n \"lcl|NC_000964.3_cds_NP_387886.2\" ⋯ 248 bytes ⋯ \"cation=4567..4812] [gbkey=CDS]\"\n \"lcl|NC_000964.3_cds_NP_387887.1\" ⋯ 466 bytes ⋯ \"cation=4867..6783] [gbkey=CDS]\"\n[...]\n\njulia> seq_descr[1]\n\"lcl|NC_000964.3_cds_NP_387882.1_1 [gene=dnaA] [locus_tag=BSU_00010] [db_xref=EnsemblGenomes-Gn:BSU00010,EnsemblGenomes-Tr:CAB11777,GOA:P05648,InterPro:IPR001957,InterPro:IPR003593,InterPro:IPR010921,InterPro:IPR013159,InterPro:IPR013317,InterPro:IPR018312,InterPro:IPR020591,InterPro:IPR024633,InterPro:IPR027417,PDB:4TPS,SubtiList:BG10065,UniProtKB/Swiss-Prot:P05648] [protein=chromosomal replication initiator informational ATPase] [protein_id=NP_387882.1] [location=410..1750] [gbkey=CDS]\"\n\n\n\n\n\n","category":"method"},{"location":"#CUBScout.seq_names-Tuple{AbstractString}","page":"Home","title":"CUBScout.seq_names","text":"seq_names(path::AbstractString)\n\nRead a fasta file at path and return the name fields. Just adds convenience on top of FASTX functions.\n\nExamples\n\njulia> seq_names(example_data_path)\n4237-element Vector{String}:\n \"lcl|NC_000964.3_cds_NP_387882.1_1\"\n \"lcl|NC_000964.3_cds_NP_387883.1_2\"\n \"lcl|NC_000964.3_cds_NP_387884.1_3\"\n \"lcl|NC_000964.3_cds_NP_387885.1_4\"\n \"lcl|NC_000964.3_cds_NP_387886.2_5\"\n \"lcl|NC_000964.3_cds_NP_387887.1_6\"\n[...]\n\n\n\n\n\n","category":"method"}]
}
